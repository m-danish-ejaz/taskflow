import React from "react";
import { Label } from "@/app/components/ui/label/label";
import { InputProps } from "../models/inputModel";

const SelectInput: React.FC<InputProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const isRequired = field.validators?.some(v => v.type === "required");
  return (
    <div className="h-fit">
      <div className={`flex flex-col ${field.wrapperClass || ""}`}>
        {field.label && (
          <Label className={`text-sm font-medium ${field.labelClass}`} htmlFor={field.modelName}>
            {field.label} {isRequired && <span className="text-rose-600">*</span>}
          </Label>
        )}
        <select
          id={field.modelName}
          name={field.modelName}
          value={value}
          onChange={(e) => onChange(field.modelName, e.target.value)}
          className={field.inputClass}>
          <option value="" disabled className="text-slate-800">
            {field.placeholder || "Select an option"}
          </option>
          {field.options?.map((option, index) => (
            <option
              key={index}
              value={option.value}
              className={field.className}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default SelectInput;
