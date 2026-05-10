import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  hint?: string;
}

export default function Input({
  label,
  error,
  icon,
  iconRight,
  hint,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[#334155]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full rounded-xl border bg-white text-[#1e293b] placeholder:text-[#94a3b8]
            transition-all duration-200 outline-none
            focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]
            ${error ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500' : 'border-[#e2e8f0]'}
            ${icon ? 'pl-10' : 'pl-4'}
            ${iconRight ? 'pr-10' : 'pr-4'}
            py-2.5 text-sm
            ${className}
          `}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-[#94a3b8]">{hint}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className = '', id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[#334155]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          w-full rounded-xl border bg-white text-[#1e293b] placeholder:text-[#94a3b8]
          transition-all duration-200 outline-none resize-none
          focus:ring-2 focus:ring-[#0d61a3]/20 focus:border-[#0d61a3]
          ${error ? 'border-red-400' : 'border-[#e2e8f0]'}
          px-4 py-2.5 text-sm
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#94a3b8]">{hint}</p>}
    </div>
  );
}
