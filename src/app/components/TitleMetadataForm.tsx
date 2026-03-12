"use client";
import { useState } from "react";

export default function TitleMetadataForm({ onGenerate }: { onGenerate: (data: any, originalForm: any) => void }) {
  const [formData, setFormData] = useState({
    title_id: "", title_name: "", cast: "", director: "", source_synopsis: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/synopsis/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      // Check karein ke res.ok (200) ho aur data maujood ho
      if (res.ok && result && result.data) {
        onGenerate(result.data, formData); 
      } else {
        console.error("API Error or Missing Data:", result);
        alert(result.error || "Generation failed. Please try again.");
        // Null bhejne se application crash hone se bach jayegi
        onGenerate(null, formData);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Network error. Please check your connection.");
      onGenerate(null, formData);
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-sm font-semibold text-slate-700 mb-2 ml-1";
  const inputClass = "w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 shadow-sm";

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      
      <div className="mb-8 p-8 bg-linear-to-br from-indigo-600 via-violet-600 to-indigo-700 rounded-[2.5rem] shadow-2xl shadow-indigo-500/30 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-2">
           <p className="text-violet-100/90 font-medium text-lg">
             Configure your AI generation parameters with precision
           </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 shadow-xl space-y-6">
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Title ID</label>
            <input className={inputClass} placeholder="e.g. MOV-001" required onChange={(e) => setFormData({...formData, title_id: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Title Name</label>
            <input className={inputClass} placeholder="e.g. The Matrix" required onChange={(e) => setFormData({...formData, title_name: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Cast</label>
            <input className={inputClass} placeholder="e.g. Keanu Reeves" onChange={(e) => setFormData({...formData, cast: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Director</label>
            <input className={inputClass} placeholder="e.g. Wachowskis" onChange={(e) => setFormData({...formData, director: e.target.value})} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Source Synopsis</label>
          <textarea 
            className={`${inputClass} h-40 resize-none`} 
            placeholder="Paste your source text here..." 
            required
            onChange={(e) => setFormData({...formData, source_synopsis: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-5 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20 text-lg"
        >
          {loading ? "Processing..." : "Generate Synopsis"}
        </button>
      </form>
    </div>
  );
}