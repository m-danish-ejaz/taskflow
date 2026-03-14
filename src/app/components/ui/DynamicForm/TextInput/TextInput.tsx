import React, { useState } from "react";
import { Input } from "@/app/components/ui/input/input";
import { Label } from "@/app/components/ui/label/label";
import { InputProps } from "../models/inputModel";
import { Eye, EyeOff } from "lucide-react";

const TextInput: React.FC<InputProps & { error?: string }> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const isRequired = field.validators?.some((v) => v.type === "required");
  const [show, setShow] = useState(false);
  const isPassword = field.type === "password";

  return (
    <div className="h-fit">
      <div className={`flex flex-col ${field.wrapperClass || ""}`}>
        {/* Label */}
        {field.label && (
          <Label className={`text-sm font-medium mb-1 ${field.labelClass}`} htmlFor={field.modelName}>
            {field.label} {isRequired && <span className="text-rose-600">*</span>}
          </Label>
        )}

        <div className="relative w-full">
          <Input
            type={isPassword ? (show ? "text" : "password") : field.type}
            id={field.modelName}
            name={field.modelName}
            value={value}
            onChange={(e) => onChange(field.modelName, e.target.value)}
            placeholder={field.placeholder}
            className={`${field.inputClass} ${isPassword ? "pr-10" : ""}`}
          />

          {/* Show/Hide Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 mt-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TextInput;