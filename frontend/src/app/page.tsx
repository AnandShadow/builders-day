"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ShieldAlert, 
  Upload, 
  FileText, 
  Link as LinkIcon, 
  CheckCircle, 
  AlertTriangle,
  XOctagon,
  ChevronRight,
  Download,
  LogOut,
  User
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type AnalysisResult = {
  threat_category: string;
  risk_index: number;
  english_translation: string;
  localized_warning: string;
};

export default function FinShieldDashboard() {
  const [activeTab, setActiveTab] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("finshield_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch(e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("finshield_user");
    setUser(null);
  };
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingSteps = [
    "Extracting entities & text...",
    "Cross-referencing threat databases...",
    "Running Gemini AI heuristic analysis...",
    "Finalizing risk assessment..."
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!inputValue && !selectedImage) {
      setError("Please provide text, URL, or an image to analyze.");
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    setResult(null);
    setLoadingStep(0);

    // Simulate multi-step loading animation
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append("file", selectedImage);
      } else {
        // If no image is provided, we send a dummy transparent 1x1 image as the backend requires a file.
        // In a real production scenario, the backend should handle text-only requests.
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
        const dummyFile = new File([blob], "dummy.png", { type: "image/png" });
        formData.append("file", dummyFile);
      }
      
      if (inputValue) {
        formData.append("description", inputValue);
      }

      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to analyze. Ensure backend is running.");
      }

      const data: AnalysisResult = await res.json();
      
      // Delay slightly for effect if api is too fast
      setTimeout(() => {
        clearInterval(interval);
        setResult(data);
        setIsAnalyzing(false);
      }, 500);
      
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setIsAnalyzing(false);
    }
  };

  // Generate Recharts data for the risk gauge
  const riskScore = result ? (result.risk_index / 5) * 100 : 0;
  const gaugeData = [
    { name: "Risk", value: riskScore },
    { name: "Safe", value: 100 - riskScore }
  ];
  const COLORS = riskScore >= 80 ? ["#EF4444", "#1E293B"] : riskScore >= 60 ? ["#F59E0B", "#1E293B"] : ["#10B981", "#1E293B"];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 overflow-x-hidden selection:bg-blue-500/30">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-emerald-500 h-6 w-6" />
            <span className="font-bold text-xl tracking-tight">FinShield<span className="text-emerald-500">.ai</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link href="#" className="hover:text-slate-50 transition-colors">How it Works</Link>
            <Link href="#" className="hover:text-slate-50 transition-colors">Safety Tips</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors hidden md:block"
            >
              Bank & Admin Portal
            </Link>
            {user ? (
              <div className="flex items-center gap-3 bg-slate-800/50 rounded-full pl-3 pr-1 py-1 border border-slate-700">
                <span className="text-sm font-medium text-slate-200 hidden sm:block">{user.name}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-slate-700 hover:bg-red-500/20 hover:text-red-400" onClick={handleLogout}>
                  <LogOut className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Link 
                href="/login"
                className={buttonVariants({ variant: "outline", className: "border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white" })}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            Is that message a scam? <br /> <span className="text-emerald-500">Let&apos;s find out.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl">
            Protect yourself and your family. Paste any suspicious SMS, email, or WhatsApp screenshot below and our AI will check if it&apos;s safe.
          </p>
        </div>

        {/* Main Input Zone */}
        <Card className="w-full max-w-2xl bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-2xl shadow-emerald-900/10 mb-8">
          <CardHeader>
            <CardTitle>Check a Message</CardTitle>
            <CardDescription className="text-slate-400">Paste the text or upload a screenshot to see if it&apos;s safe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-700 p-1">
                <TabsTrigger value="text" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><FileText className="w-4 h-4 mr-2"/> Text / SMS</TabsTrigger>
                <TabsTrigger value="url" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><LinkIcon className="w-4 h-4 mr-2"/> URL</TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Upload className="w-4 h-4 mr-2"/> Image / Invoice</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="text" className="m-0 focus-visible:outline-none">
                  <textarea 
                    className="w-full min-h-[120px] rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    placeholder="Paste the suspicious SMS, email, or message text here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="url" className="m-0 focus-visible:outline-none">
                  <Input 
                    type="url" 
                    placeholder="https://suspicious-domain.com/login" 
                    className="bg-slate-900 border-slate-700 focus-visible:ring-blue-500"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="image" className="m-0 focus-visible:outline-none">
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-800/30 transition-colors cursor-pointer relative group">
                    {imagePreview ? (
                      <div className="relative w-full flex justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Preview" className="max-h-[200px] object-contain rounded-md shadow-md" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                          <span className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4"/> Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 mb-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        <p className="text-sm font-medium mb-1">Click or drag image to upload</p>
                        <p className="text-xs text-slate-500">Supports PNG, JPG, JPEG (Max 10MB)</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </div>
                  {activeTab === "image" && (
                    <div className="mt-4">
                      <Input 
                        placeholder="Optional: Add context or description of where you found this..." 
                        className="bg-slate-900 border-slate-700 focus-visible:ring-blue-500"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {error && <div className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> {error}</div>}
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 h-12 text-lg font-medium" 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Threat"}
            </Button>
          </CardFooter>
        </Card>

        {/* Loading State & Results View */}
        <div className="w-full max-w-4xl min-h-[400px]">
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center justify-center py-20 space-y-8"
              >
                <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
                <div className="space-y-4 w-full max-w-md">
                  {loadingSteps.map((step, idx) => (
                    <div key={idx} className={`flex items-center gap-3 transition-opacity duration-500 ${idx === loadingStep ? 'opacity-100' : idx < loadingStep ? 'opacity-50 text-emerald-400' : 'opacity-30'}`}>
                      {idx < loadingStep ? <CheckCircle className="w-5 h-5" /> : idx === loadingStep ? <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/> : <div className="w-5 h-5 rounded-full border-2 border-slate-700" />}
                      <span className={idx === loadingStep ? "text-white font-medium" : ""}>{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Score Column */}
                <Card className="col-span-1 bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" style={{ color: COLORS[0] }} />
                  <div className="w-48 h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gaugeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          startAngle={180}
                          endAngle={0}
                          paddingAngle={0}
                          dataKey="value"
                          stroke="none"
                        >
                          {gaugeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
                      <span className="text-4xl font-bold" style={{ color: COLORS[0] }}>{riskScore}</span>
                      <span className="text-slate-400 text-sm font-medium">Risk Score</span>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4 space-y-1">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2">
                      {result.risk_index >= 4 ? <><XOctagon className="w-5 h-5 text-red-500" /> CRITICAL RISK</> : 
                       result.risk_index === 3 ? <><AlertTriangle className="w-5 h-5 text-amber-500" /> MODERATE RISK</> : 
                       <><CheckCircle className="w-5 h-5 text-emerald-500" /> SAFE</>}
                    </h3>
                    <p className="text-slate-400 font-medium">{result.threat_category}</p>
                  </div>
                </Card>

                {/* Details Column */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
                  {/* Executive Summary */}
                  <Card className="bg-slate-800/80 border-slate-700 shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Executive Summary</span>
                        <Button variant="outline" size="sm" className="h-8 border-slate-600 bg-slate-700/50 hover:bg-slate-700">
                          <Download className="w-4 h-4 mr-2" /> Export PDF
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-300 leading-relaxed">
                        {result.localized_warning}
                      </div>
                      
                      <div className="mt-5">
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Threat Matrix Indicators</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.risk_index >= 4 ? (
                            <>
                              <Badge variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">Urgency Tactics Used</Badge>
                              <Badge variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">Financial Request</Badge>
                              <Badge variant="outline" className="border-amber-500/30 text-amber-400">Unverified Source</Badge>
                            </>
                          ) : result.risk_index === 3 ? (
                            <>
                              <Badge variant="outline" className="border-amber-500/30 text-amber-400">Suspicious Link</Badge>
                              <Badge variant="outline" className="border-amber-500/30 text-amber-400">Unusual Tone</Badge>
                            </>
                          ) : (
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">Verified Pattern</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Accordion Breakdown */}
                  <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
                    <CardContent className="p-0">
                      <Accordion className="w-full">
                        <AccordionItem value="translation" className="border-b border-slate-700 px-6 py-2">
                          <AccordionTrigger className="hover:no-underline hover:text-blue-400 text-slate-200">
                            <span className="flex items-center gap-2"><FileText className="w-4 h-4"/> Vernacular Extraction & Translation</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-400">
                            <div className="bg-slate-900/50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap border border-slate-800">
                              {result.english_translation}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="linguistic" className="border-b border-slate-700 px-6 py-2">
                          <AccordionTrigger className="hover:no-underline hover:text-blue-400 text-slate-200">
                            <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Linguistic & Psychological Analysis</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-400">
                            <p className="mb-2">The AI detected manipulative phrasing designed to bypass logical reasoning by inducing panic. Keywords such as <span className="text-red-400 bg-red-900/30 px-1 rounded">&quot;immediately&quot;</span> and <span className="text-red-400 bg-red-900/30 px-1 rounded">&quot;disconnect&quot;</span> are classic indicators of urgency-based social engineering.</p>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="action" className="border-none px-6 py-2">
                          <AccordionTrigger className="hover:no-underline hover:text-blue-400 text-slate-200">
                            <span className="flex items-center gap-2"><ChevronRight className="w-4 h-4"/> Recommended Next Steps</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-400">
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Do not click on any links provided in the message.</li>
                              <li>Do not reply or call the number back directly.</li>
                              <li>Contact your service provider through their official website or customer service number found on a recent bill.</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Live Threat Ticker */}
      <div className="fixed bottom-0 w-full bg-slate-950 border-t border-slate-800 text-xs text-slate-500 flex items-center h-8 overflow-hidden z-50">
        <div className="w-24 bg-slate-900 h-full flex items-center justify-center font-bold tracking-widest text-slate-400 z-10 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.5)]">LIVE</div>
        <div className="flex-1 whitespace-nowrap overflow-hidden">
          <div className="animate-ticker inline-block">
            <span className="mx-4 text-red-500/80">⚠️ [KYC Fraud] Spike in fake bank SMS detected in Maharashtra</span>
            <span className="mx-4 text-amber-500/80">⚡ [Utility Scam] Disconnection threats rising in Bangalore region</span>
            <span className="mx-4 text-blue-500/80">🛡️ [System Update] New threat signatures added for WhatsApp job scams</span>
            <span className="mx-4 text-red-500/80">⚠️ [KYC Fraud] Spike in fake bank SMS detected in Maharashtra</span>
          </div>
        </div>
      </div>
    </div>
  );
}
