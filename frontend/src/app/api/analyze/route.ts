import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// Initialize Prisma
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

// 1. Zod Schema for strict output validation
const ThreatFlagSchema = z.object({
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  category: z.string(),
  description: z.string(),
  audit_trail_reasoning: z.string()
});

const AnalysisSchema = z.object({
  isScam: z.boolean(),
  riskScore: z.number().min(0).max(100),
  summary: z.string(),
  threatFlags: z.array(ThreatFlagSchema)
});

const SYSTEM_PROMPT = `
You are an elite financial cybersecurity AI. Analyze the provided text, URL, or image for fraud.
You must factor in the heuristic message intent AND the provided device context (user-agent/IP).
Output strictly in JSON format matching this exact schema:
{
  "riskScore": number (0-100, 100 being critical scam),
  "summary": string (2-sentence executive summary of the threat),
  "isScam": boolean,
  "threatFlags": [
    {
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "category": string (e.g. "Domain Spoofing", "Artificial Urgency"),
      "description": string (detailed explanation of the tactic),
      "audit_trail_reasoning": string (Explainable AI: EXACTLY why you flagged it and mapping it to the text/image/context)
    }
  ]
}
Do not include markdown blocks like \`\`\`json. Return raw JSON only.
`;

export async function POST(req: NextRequest) {
  try {
    // Collect device context
    const userAgent = req.headers.get("user-agent") || "unknown";
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const deviceContext = JSON.stringify({ userAgent, ip, location: "Local/Mock" });

    const userId = "dummy_user_id";

    const formData = await req.formData();
    const textInput = formData.get("text") as string;
    const file = formData.get("file") as File;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const promptContents: (string | { inlineData: { data: string; mimeType: string } })[] = [
      SYSTEM_PROMPT,
      `Device Context: ${deviceContext}`
    ];

    if (textInput) promptContents.push(`Input to analyze: ${textInput}`);
    
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      promptContents.push({
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type
        }
      });
    }

    if (promptContents.length === 2) { // Only prompt + context
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    const result = await model.generateContent({
      contents: promptContents,
      generationConfig: { responseMimeType: "application/json" }
    });

    const rawResponse = result.response.text();
    let parsedJson;
    
    try {
      parsedJson = JSON.parse(rawResponse);
    } catch (e) {
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 });
    }

    // 2. Strict Zod Validation
    const validationResult = AnalysisSchema.safeParse(parsedJson);

    if (!validationResult.success) {
      console.error("Zod Validation Error:", validationResult.error);
      return NextResponse.json({ 
        error: "AI output failed security validation schema.", 
        details: validationResult.error.errors 
      }, { status: 500 });
    }

    const aiResponse = validationResult.data;

    // Ensure dummy user exists
    await prisma.user.upsert({
      where: { email: "demo@finshield.ai" },
      update: {},
      create: { email: "demo@finshield.ai", name: "Demo User", role: "USER", id: "dummy_user_id" },
    });

    // 3. Save to DB with new fields
    const scan = await prisma.scan.create({
      data: {
        userId,
        rawInput: textInput || "Image Upload",
        deviceContext,
        riskScore: aiResponse.riskScore,
        summary: aiResponse.summary,
        isScam: aiResponse.isScam,
        threatFlags: {
          create: aiResponse.threatFlags.map(flag => ({
            severity: flag.severity,
            category: flag.category,
            description: flag.description,
            auditTrailReasoning: flag.audit_trail_reasoning
          }))
        }
      },
      include: { threatFlags: true }
    });
    
    return NextResponse.json(scan);

  } catch (error: unknown) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Failed to process forensic analysis." }, { status: 500 });
  }
}
