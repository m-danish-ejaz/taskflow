import React from "react";
import { Label } from "@/app/components/ui/label/label";
import { Input } from "@/app/components/ui/input/input";
import { InputProps } from "../models/inputModel";
import { error } from "console";

const TextArea: React.FC<InputProps & { error?: string }> = ({
  field,
  value,
  onChange,
  error
}) => {
  const isRequired = field.validators?.some(v => v.type === "required");

  return (
    <div className="h-fit">
      <div className={`flex flex-col ${field.wrapperClass || ""}`}>
        <Label className={`text-sm font-medium ${field.labelClass}`} htmlFor={field.modelName}>
          {field.label} {isRequired && <span className="text-rose-600">*</span>}
        </Label>
        <Input
          type="text"
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

export default TextArea;
