import React from "react";
import { Input } from "@/app/components/ui/input/input";
import { Label } from "@/app/components/ui/label/label";
import { InputProps } from "../models/inputModel";

const TextInput: React.FC<InputProps & { error?: string }> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const isRequired = field.validators?.some(v => v.type === "required");
  return (
    <div className="h-fit">
      <div className={`flex flex-col ${field.wrapperClass || ""}`}>
        <Label className={`text-sm font-medium ${field.labelClass}`} htmlFor={field.modelName}>
          {field.label} {isRequired && <span className="text-rose-600">*</span>}
        </Label>
        <Input
          type={field.type}
          id={field.modelName}
          name={field.modelName}
          value={value}
          onChange={(e) => onChange(field.modelName, e.target.value)}
          placeholder={field.placeholder}
          className={field.inputClass}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default TextInput;
