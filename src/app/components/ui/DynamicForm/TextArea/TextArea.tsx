import React from "react";
import { Label } from "@/app/components/ui/label/label";
import { Input } from "@/app/components/ui/input/input";
import { InputProps } from "../models/inputModel";

const TextArea: React.FC<InputProps> = ({ field, value, onChange }) => {
  return (
    <div className={field.className}>
      <Label className=" mb-2" htmlFor={field.modelName}>
        {field.label}
      </Label>
      <Input
        type="text"
        id={field.modelName}
        name={field.modelName}
        value={value}
        onChange={(e) => onChange(field.modelName, e.target.value)}
        placeholder={field.placeholder}
        className="h-full border-0 bg-transparent"
      />
    </div>
  );
};

export default TextArea;
