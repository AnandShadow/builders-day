import Link from 'next/link';

export default function ThreatIntel() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold text-blue-500 mb-4">Threat Intelligence</h1>
      <p className="text-slate-400 max-w-lg mb-8">
        Live geographic threat mapping and zero-day heuristic signatures are currently being aggregated. 
        This module will be available in the upcoming v2.0 release.
      </p>
      <Link href="/" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-md font-medium transition-colors">
        Return to Home
      </Link>
    </div>
  );
}
