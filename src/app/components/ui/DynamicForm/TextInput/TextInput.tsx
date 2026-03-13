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
  return (
    <div className="h-fit">
      <div className={field.className}>
        <Label className="mb-2" htmlFor={field.modelName}>
          {field.label}
        </Label>
        <Input
          type={field.type}
          id={field.modelName}
          name={field.modelName}
          value={value}
          onChange={(e) => onChange(field.modelName, e.target.value)}
          placeholder={field.placeholder}
          className="h-full border-0 bg-transparent"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default TextInput;
