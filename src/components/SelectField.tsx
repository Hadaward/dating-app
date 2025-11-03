"use client";

import ExpandMore from "@mui/icons-material/ExpandMore";

export interface SelectOptionProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface SelectFieldProps {
  name: string;
  value?: string;
  children: React.ReactNode;
  options?: SelectOptionProps[];
  onChange?: (value: string) => void;
}

export default function SelectField({
  name,
  value = "",
  children,
  options = [],
  onChange,
}: SelectFieldProps) {
  return (
    <div className={`w-full relative transition-all duration-200`}>
      <div className={`transition-all duration-200`}>
        {
          value.length === 0 && (
            <label
              className="absolute transition-all duration-200 pointer-events-none font-lexend font-medium left-6 text-gray-400 text-lg top-4 z-10"
            >
              {children}
            </label>
          )
        }

        <div className="p-0.5 rounded-[4rem] transition-all duration-200 bg-linear-to-r from-[#DD3562] to-[#8354FF] relative">
          <select
            name={name}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full px-6 py-4 pr-12 text-white bg-[#03000C] rounded-[4rem] focus:outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled hidden></option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-[#03000C] text-white"
              >
                {option.children}
              </option>
            ))}
          </select>
          
          <ExpandMore 
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
            sx={{ fontSize: 20 }}
          />
        </div>
      </div>
    </div>
  );
}