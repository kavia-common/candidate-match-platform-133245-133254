"use client";

import React from "react";
import { cn } from "@/lib/classnames";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export default function Input({ label, hint, error, className, id, ...rest }: Props) {
  // Always call useId to satisfy hooks rules; then prefer provided id if passed
  const autoId = React.useId();
  const inputId = id ?? autoId;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          error && "border-red-400 focus:border-red-500 focus:ring-red-200",
          className
        )}
        {...rest}
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
