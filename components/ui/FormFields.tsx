import { type ComponentPropsWithoutRef } from "react";
import { IconAlert } from "./Icons";

/* ─── Input ─── */
interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-[8px] border-3 px-3 py-2 text-base bg-white min-h-[44px] ${
          error ? "border-danger" : "border-ink"
        }`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-danger flex items-center gap-1.5">
          <IconAlert className="w-3.5 h-3.5 text-danger shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/* ─── Select ─── */
interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, id, options, className = "", ...props }: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={selectId} className="text-sm font-semibold">
        {label}
      </label>
      <select
        id={selectId}
        className={`rounded-[8px] border-3 px-3 py-2 text-base bg-white min-h-[44px] ${
          error ? "border-danger" : "border-ink"
        }`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-danger flex items-center gap-1.5">
          <IconAlert className="w-3.5 h-3.5 text-danger shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/* ─── Textarea ─── */
interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, className = "", ...props }: TextareaProps) {
  const textareaId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={textareaId} className="text-sm font-semibold">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`rounded-[8px] border-3 px-3 py-2 text-base bg-white min-h-[100px] ${
          error ? "border-danger" : "border-ink"
        }`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="text-sm text-danger flex items-center gap-1.5">
          <IconAlert className="w-3.5 h-3.5 text-danger shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

