import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Support hackathon dummy inputs
    if (email === "admin" || email === "user") {
      return NextResponse.json({ 
        success: true, 
        role: email === "admin" ? "ADMIN" : "USER",
        user: { name: email === "admin" ? "Admin" : "Demo User", email }
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ success: true, role: user.role, user: userWithoutPassword });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
