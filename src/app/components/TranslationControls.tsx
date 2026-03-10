"use client";
import { useState } from "react";

const LANGUAGES = ["Urdu", "Arabic", "French", "German", "Spanish", "Hindi", "Japanese"];

export default function TranslationControls({ onTranslate }: { onTranslate: (lang: string) => void }) {
  const [selectedLang, setSelectedLang] = useState("");

  return (
    <div className="flex gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm mt-8 items-center">
      <label className="font-semibold text-gray-700">Translate to:</label>
      <select 
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)} 
        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
      >
        <option value="">Select Language</option>
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
      
      <button 
        onClick={() => {
          if (!selectedLang) return alert("Please select a language first!");
          onTranslate(selectedLang);
        }}
        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
      >
        Translate Now
      </button>
    </div>
  );
}