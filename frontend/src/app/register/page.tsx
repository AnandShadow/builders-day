"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Key, Mail, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("finshield_user", JSON.stringify(data.user || { name, email }));
        window.location.href = "/";
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create account");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
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
          <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
          <CardDescription className="text-slate-400">
            Sign up to save your scam analysis history and protect your family.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder="John Doe" 
                  className="pl-9 bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-emerald-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  type="email"
                  placeholder="name@example.com" 
                  className="pl-9 bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  type="password" 
                  placeholder="Create a secure password" 
                  className="pl-9 bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-emerald-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Account Type</label>
                <select 
                  className="w-full h-10 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="USER">Standard User (Consumer)</option>
                  <option value="ADMIN">Bank / Enterprise Admin</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isLoading ? "Creating account..." : "Sign Up"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            
            <div className="text-center text-sm text-slate-400 pt-2 w-full">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-500 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
