"use client";
import { useState } from "react";

interface FormProps {
  onGenerate: (data: any) => void;
}

export default function TitleMetadataForm({ onGenerate }: FormProps) {
  const [formData, setFormData] = useState({
    title_id: "",
    title_name: "",
    cast: "",
    director: "",
    source_synopsis: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  // Helper component for cleaner code
  const FormField = ({ label, name, placeholder }: { label: string, name: string, placeholder: string }) => (
    <div className="flex flex-col md:flex-row md:items-center gap-2">
      <label className="w-full md:w-1/3 font-semibold text-gray-700">{label}:</label>
      <input
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        value={(formData as any)[name]}
        className="p-2 border rounded-lg w-full md:w-2/3"
        required={name !== "cast" && name !== "director"}
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-xl border border-gray-100"
    >
      <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">
        Title Metadata & Synopsis
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <FormField label="Title ID" name="title_id" placeholder="e.g., T1001" />
        <FormField label="Title Name" name="title_name" placeholder="Movie Title" />
        <FormField label="Cast" name="cast" placeholder="Actors name..." />
        <FormField label="Director" name="director" placeholder="Director name..." />
      </div>

      <div className="mt-6">
        <label className="block font-semibold text-gray-700 mb-2">Source Synopsis:</label>
        <textarea
          name="source_synopsis"
          placeholder="Paste your story here..."
          onChange={handleChange}
          value={formData.source_synopsis}
          className="w-full p-4 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
      >
        Generate Synopsis
      </button>
    </form>
  );
}