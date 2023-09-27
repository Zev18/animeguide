import React from "react";

export default function FormField({
  name,
  label,
  description,
  required,
  content,
}: {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  content?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        <label className="text-lg">{label}</label>
        {required && <span className="text-red-500">Required</span>}
      </div>
      <p className="text-slate-500">{description}</p>
      <input
        className="my-1 rounded-lg border-[.25rem] border-slate-200 bg-slate-200 p-2 px-3 outline-none transition-all duration-200 focus:border-cyan-200 focus:bg-white"
        type="text"
        value={content ? content : ""}
        name={name}
      />
    </div>
  );
}
