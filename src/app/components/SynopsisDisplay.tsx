"use client";
import { useState, useEffect } from "react";

export default function SynopsisDisplay({ data, onSave, onRegenerateAll, onRegenerateSingle }: any) {
  const [synopsis, setSynopsis] = useState(data);
  const [targetLang, setTargetLang] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setSynopsis(data);
  }, [data]);

  const showStatus = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 3000);
  };

  const getLimit = (type: string) => (type === "short" ? 120 : type === "medium" ? 200 : 350);

  const handleRegenAllClick = async () => {
    setLoading("all");
    showStatus("Regenerating all versions...");
    await onRegenerateAll();
    setLoading(null);
  };

  const handleRegenSingle = async (type: string) => {
    setLoading(type);
    showStatus(`Regenerating ${type}...`);
    await onRegenerateSingle(type);
    setLoading(null);
  };

  const handleTranslate = async (type: string) => {
    if (!targetLang) return alert("Select a language first!");
    setLoading(`trans_${type}`);
    showStatus(`Translating to ${targetLang}...`);
    
    try {
      const res = await fetch("/api/synopsis/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: synopsis[type], target_language: targetLang }),
      });

      if (!res.ok) throw new Error("Server error");
      
      const result = await res.json();
      
      // Backend se jo response aaye ga usay yahan set kar rahe hain
      if (result.translated_text) {
        setSynopsis({ ...synopsis, [type]: result.translated_text });
        showStatus("Translation complete!");
      } else {
        console.error("Invalid API Response:", result);
        alert("API response empty or invalid.");
      }
    } catch (err) {
      console.error("Translate Error:", err);
      alert("Translation failed. Check console.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 mt-10 animate-in fade-in duration-500">
      {status && (
        <div className="fixed top-5 right-5 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50">
          {status}
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
        <h2 className="font-bold text-slate-700">Manage Synopsis</h2>
        <button 
          onClick={handleRegenAllClick} 
          disabled={loading === "all"}
          className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-black transition-all disabled:bg-slate-400"
        >
          {loading === "all" ? "Regenerating..." : "Regenerate All"}
        </button>
      </div>

      {["short", "medium", "long"].map((type) => (
        <div key={type} className="bg-white p-7 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-extrabold text-lg text-slate-800 capitalize">{type} Synopsis</h3>
            <div className="flex items-center gap-3">
              <select onChange={(e) => setTargetLang(e.target.value)} className="border p-2 rounded-lg text-xs">
                <option value="">Language</option>
                {["Urdu", "Arabic", "Japanese", "French"].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <button onClick={() => handleTranslate(type)} disabled={loading === `trans_${type}`} className="text-xs bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100">
                {loading === `trans_${type}` ? "..." : "Translate"}
              </button>
              <button onClick={() => handleRegenSingle(type)} disabled={loading === type} className="text-xs border px-4 py-2 rounded-lg font-bold hover:bg-slate-50">
                {loading === type ? "..." : `Regen`}
              </button>
            </div>
          </div>

          <textarea 
            value={synopsis[type] || ""} 
            onChange={(e) => setSynopsis({...synopsis, [type]: e.target.value})}
            className="w-full h-32 p-4 border rounded-xl text-sm focus:ring-2 focus:ring-blue-400 bg-slate-50"
          />
          <div className="flex justify-end mt-2">
            <span className={`text-xs font-bold ${synopsis[type]?.length > getLimit(type) ? 'text-red-500' : 'text-slate-400'}`}>
              {synopsis[type]?.length || 0} / {getLimit(type)} characters
            </span>
          </div>
        </div>
      ))}

      <div className="sticky bottom-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 flex justify-end">
        <button 
          onClick={() => onSave(synopsis)} 
          className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          Save Final Data to Database
        </button>
      </div>
    </div>
  );
}