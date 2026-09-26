"use client";

import { UploadCloud, ShieldAlert, Activity, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// Mock data representing fetched Prisma records
const RECENT_SCANS = [
  { id: "scn_992a", date: "2026-09-26", type: "SMS", score: 95, status: "CRITICAL", summary: "Fake KYC disconnection notice." },
  { id: "scn_881b", date: "2026-09-25", type: "Email", score: 12, status: "SAFE", summary: "Legitimate promotional newsletter." },
  { id: "scn_770c", date: "2026-09-24", type: "URL", score: 65, status: "WARNING", summary: "Unverified third-party payment gateway." },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans selection:bg-emerald-500/30">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Security Command Center</h1>
            <p className="text-slate-400 mt-1">Real-time telemetry and heuristic scam detection.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
            Generate Compliance Report
          </Button>
        </header>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Forensics Run</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,284</div>
              <p className="text-xs text-emerald-500 mt-1">+14% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">High Risk Threats</CardTitle>
              <ShieldAlert className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-rose-500">342</div>
              <p className="text-xs text-slate-500 mt-1">Detected across 4 vectors</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Account Safety Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500">92/100</div>
              <Progress value={92} className="h-2 mt-3 bg-slate-800" />
            </CardContent>
          </Card>
        </div>

        {/* Action Zone & Table Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload Zone */}
          <Card className="lg:col-span-1 bg-slate-900 border-slate-800 border-dashed shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">New Inspection</CardTitle>
              <CardDescription className="text-slate-400">Upload payload for sandbox analysis.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center h-[300px]">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-blue-500">
                <UploadCloud size={28} />
              </div>
              <h3 className="font-medium text-slate-200 mb-1">Drag & Drop Intel</h3>
              <p className="text-sm text-slate-500 mb-6">Support for SMS screenshots, URLs, or raw text payloads.</p>
              <div className="w-full relative">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 pointer-events-none">
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Scans Table */}
          <Card className="lg:col-span-2 bg-slate-900 border-slate-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Historical Scans</CardTitle>
              <CardDescription className="text-slate-400">Recent analysis logs associated with this account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-slate-950/50">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">ID</TableHead>
                    <TableHead className="text-slate-400">Date</TableHead>
                    <TableHead className="text-slate-400">Vector</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400 text-right">Risk Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_SCANS.map((scan) => (
                    <TableRow key={scan.id} className="border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors">
                      <TableCell className="font-mono text-xs text-slate-400">{scan.id}</TableCell>
                      <TableCell>{scan.date}</TableCell>
                      <TableCell>{scan.type}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            scan.status === "CRITICAL" ? "border-rose-500/30 text-rose-500 bg-rose-500/10" :
                            scan.status === "WARNING" ? "border-amber-500/30 text-amber-500 bg-amber-500/10" :
                            "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                          }
                        >
                          {scan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{scan.score}/100</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
