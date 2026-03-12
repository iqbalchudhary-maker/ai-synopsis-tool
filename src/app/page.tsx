"use client";
import { useState } from "react";
import TitleMetadataForm from "./components/TitleMetadataForm";
import SynopsisDisplay from "./components/SynopsisDisplay";

export default function Home() {
  const [step, setStep] = useState(0); 
  const [result, setResult] = useState<any>(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [lastFormData, setLastFormData] = useState<any>(null);

  const applyLimits = (data: any) => {
    if (!data || typeof data !== 'object') return { short: "", medium: "", long: "" };
    return {
      short: (data.short || "").substring(0, 120),
      medium: (data.medium || "").substring(0, 200),
      long: (data.long || "").substring(0, 350)
    };
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === "tanvir" && credentials.password === "tanvir123") {
      setStep(2);
    } else {
      alert("Invalid Credentials! Use: tanvir / tanvir123");
    }
  };

  // UPDATED: Handle Save Integration
  const handleSave = async (manualEdits: any) => {
    if (!lastFormData) return alert("No metadata found to save!");

    const payload = {
      title_id: lastFormData.title_id,
      title_name: lastFormData.title_name,
      cast: lastFormData.cast,
      director: lastFormData.director,
      source_synopsis: lastFormData.source_synopsis,
      short_synopsis: manualEdits.short,
      medium_synopsis: manualEdits.medium,
      long_synopsis: manualEdits.long,
      language_code: "en",
      created_by: "tanvir"
    };

    console.log("🚀 Sending to Database:", payload);

    try {
      const response = await fetch("/api/synopsis/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        alert("Synopsis successfully saved to database!");
      } else {
        throw new Error(result.message || "Failed to save");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error: Failed to save to database. Check console for details.");
    }
  };

  const handleRegenAll = async () => {
    if (!lastFormData) return alert("No form data found!");
    try {
      const res = await fetch("/api/synopsis/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastFormData),
      });
      const response = await res.json();
      setResult(applyLimits(response.data || {}));
    } catch (err) {
      alert("Failed to regenerate.");
    }
  };

  const handleRegenSingle = async (type: string) => {
    await handleRegenAll();
  };

  // --- Render Sections ---
  if (step === 0) return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center overflow-hidden relative">
    {/* Background Glow Effect */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-125 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
    
    <div className="relative z-10 max-w-2xl">
      {/* Dynamic Title with Gradient */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-blue-400 mb-6 tracking-tight">
        AI Synopsis Tool
      </h1>
      
      {/* Professional Sub-heading */}
      <p className="text-lg md:text-xl text-slate-400 mb-12 font-light max-w-md mx-auto">
        AI Synopsis Rewrite and <span className="text-blue-400 font-semibold">Translation Form</span>
      </p>
      
      {/* Animated Action Button */}
      <button 
        onClick={() => setStep(1)} 
        className="group relative px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"
      >
        <span className="flex items-center gap-2">
          Get Started
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </span>
      </button>
    </div>
  </div>
);

  if (step === 1) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-96 border">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input type="text" placeholder="Username" required className="w-full p-3 border rounded-lg mb-4" onChange={(e) => setCredentials({...credentials, username: e.target.value})} />
        <input type="password" placeholder="Password" required className="w-full p-3 border rounded-lg mb-6" onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
        <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold">Login</button>
      </form>
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto p-6 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-8 mx-4 p-5 bg-white rounded-2xl shadow-sm">
        <h1 className="text-xl font-extrabold text-slate-800">Metadata Workspace</h1>
        <button onClick={() => setStep(0)} className="text-red-500 font-bold hover:underline">Logout</button>
      </header>
      
      <TitleMetadataForm 
        onGenerate={(data: any, originalFormData: any) => {
          setLastFormData(originalFormData);
          setResult(applyLimits(data));
        }} 
      />
      
      {result && (
        <SynopsisDisplay 
          key={JSON.stringify(result)}
          data={result} 
          onSave={handleSave}
          onRegenerateAll={handleRegenAll}
          onRegenerateSingle={handleRegenSingle}
        />
      )}
    </main>
  );
}