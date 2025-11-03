"use client";
import { HTMLInputTypeAttribute, useState } from "react";

export interface TextFieldProps {
  children?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  autoComplete?: boolean;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function TextField({
  children,
  type = "text",
  name,
  value = "",
  onChange,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;
  const isDate = ["date", "datetime-local"].includes(type);

  return (
    <div className={`w-full relative transition-all duration-200 ${isActive ? 'pt-6' : 'pt-0'}`}>
      <div className={`transition-all duration-200 ${isActive ? "mb-1" : "mb-0"}`}>
        <label
          className={`absolute left-0 transition-all duration-200 pointer-events-none font-lexend font-medium ${
            isActive
              ? "text-[#DA489E] text-base -top-2"
              : "left-6 text-gray-400 text-lg top-4"
          }`}
        >
          {children}
        </label>

        <div
          className="p-0.5 rounded-[4rem] transition-all duration-200 bg-linear-to-r from-[#DD3562] to-[#8354FF]"
        >
          <input
            type={type}
            name={name}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full px-6 py-4 bg-[#03000C] rounded-[4rem] focus:outline-none ${isDate && !isActive ? "date-field text-transparent" : "text-white accent-white"}`}
          />
        </div>
      </div>
    </div>
  );
}