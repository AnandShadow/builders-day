"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Key, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: password || "demo" })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("finshield_user", JSON.stringify(data.user));
        
        if (data.role === "ADMIN" || email === "admin") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/";
        }
      } else {
        setError(data.error || "Invalid credentials.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Failed to connect to authentication server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
        <ShieldAlert className="text-emerald-500 h-8 w-8" />
        <span className="font-bold text-3xl tracking-tight text-slate-50">FinShield<span className="text-emerald-500">.ai</span></span>
      </Link>

      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">System Access</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access the portal.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email or ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder="admin@finshield.ai" 
                  className="pl-9 bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-emerald-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-9 bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-emerald-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isLoading ? "Authenticating..." : "Sign In"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            
            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-800 w-full">
              <p>Hackathon Demo Credentials:</p>
              <p className="mt-1">Admin Portal: <span className="text-slate-300 font-mono">admin</span></p>
              <p>Consumer Portal: <span className="text-slate-300 font-mono">user</span></p>
            </div>

            <div className="text-center text-sm text-slate-400 pt-2 w-full">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-emerald-500 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
