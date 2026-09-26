import Link from 'next/link';

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold text-emerald-500 mb-4">API Documentation</h1>
      <p className="text-slate-400 max-w-lg mb-8">
        The FinShield REST API documentation is currently restricted to Enterprise partners. 
        Please contact support to provision an API key and access the Swagger UI.
      </p>
      <Link href="/" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-md font-medium transition-colors">
        Return to Home
      </Link>
    </div>
  );
}
