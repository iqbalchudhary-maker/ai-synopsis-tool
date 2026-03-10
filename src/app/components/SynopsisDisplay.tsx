"use client";

interface Props {
  text: string;
  limit: number;
  label: string;
}

export default function CharacterCounter({ text, limit, label }: Props) {
  const count = text.length;
  // Agar limit se zyada hua toh user ko red color mein highlight karein
  const isOver = count > limit;

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      
      {/* Dynamic box color based on character limit */}
      <div className={`p-4 border rounded-xl transition-colors duration-200 ${
        isOver 
          ? 'bg-red-50 border-red-500 text-red-900' 
          : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <p className="whitespace-pre-wrap leading-relaxed">
          {text || "Generating..."}
        </p>
      </div>

      {/* Counter with warning message */}
      <div className={`flex justify-end mt-2 text-xs font-bold ${
        isOver ? 'text-red-600' : 'text-slate-500'
      }`}>
        {count} / {limit} {isOver && <span className="ml-2">⚠️ EXCEEDS LIMIT!</span>}
      </div>
    </div>
  );
}