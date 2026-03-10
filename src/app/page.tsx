"use client";
import { useState } from "react";
import TitleMetadataForm from "./components/TitleMetadataForm";
import TranslationControls from "./components/TranslationControls";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define handleGenerate here
  const handleGenerate = async (formData: any) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/synopsis/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("API call failed");
      const json = await res.json();
      setResult({ ...formData, ...json.data });
    } catch (error) {
      console.error("Generation Error:", error);
      alert("Synopsis generate nahi ho saka.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Define handleTranslate here
  const handleTranslate = async (lang: string) => {
    try {
      const res = await fetch("/api/synopsis/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result, target_language: lang }),
      });
      const json = await res.json();
      setResult({ 
        ...result, 
        translated_short: json.short, 
        translated_medium: json.medium, 
        translated_long: json.long,
        language_code: lang 
      });
    } catch (error) {
      alert("Translation failed.");
    }
  };

  // 3. Define handleFinalSave here
  const handleFinalSave = async () => {
    try {
      const res = await fetch("/api/synopsis/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Saved Successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Ab return mein ye functions perfectly available honge
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
       <header className="mb-12 text-center space-y-3">
  <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs uppercase tracking-widest mb-2 border border-blue-100">
    Smart Content Studio
  </div>
  
  <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
    AI Synopsis <span className="text-blue-600 font-semibold">Rewrite & Translation</span>
  </h1>
  
  <p className="text-slate-500 text-lg max-w-lg mx-auto font-medium">
    Generate, edit, and translate your film metadata with precision.
  </p>
</header>
        <TitleMetadataForm onGenerate={handleGenerate} />
        
        {isLoading && (
          <div className="text-center mt-10 font-bold text-blue-600 animate-pulse">
            Generating...
          </div>
        )}
        
        {result && !isLoading && (
          <div className="mt-10 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Review & Refine</h2>
              <div className="space-y-6">
                {["short", "medium", "long"].map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">{key}</label>
                    <textarea 
                      className="w-full h-24 bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-400"
                      value={result[key] || ""} 
                      onChange={(e) => setResult({...result, [key]: e.target.value})} 
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <TranslationControls onTranslate={handleTranslate} />
              </div>
            </div>

            {result.translated_short && (
              <div className="bg-emerald-900 p-8 rounded-3xl text-white">
                <h3 className="font-bold mb-4">Translated ({result.language_code})</h3>
                {["translated_short", "translated_medium", "translated_long"].map((key) => (
                  <textarea 
                    key={key}
                    className="w-full h-20 bg-emerald-800/50 p-4 rounded-xl mb-2"
                    value={result[key] || ""} 
                    onChange={(e) => setResult({...result, [key]: e.target.value})} 
                  />
                ))}
              </div>
            )}

            <button 
              onClick={handleFinalSave} 
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800"
            >
              Confirm & Save Data
            </button>
          </div>
        )}
      </div>
    </main>
  );
}