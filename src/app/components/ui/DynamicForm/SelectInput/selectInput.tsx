import React from "react";
import { Label } from "@/app/components/ui/label/label";
import { InputProps } from "../models/inputModel";

const SelectInput: React.FC<InputProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="h-fit">
      <div className={field.className}>
        {field.label && (
          <Label className="mb-2" htmlFor={field.modelName}>
            {field.label}
          </Label>
        )}
        <select
          id={field.modelName}
          name={field.modelName}
          value={value}
          onChange={(e) => onChange(field.modelName, e.target.value)}
          className="h-full rounded-md bg-transparent px-2 py-1 text-white border-0"
        >
          <option value="" disabled className="text-slate-800">
            {field.placeholder || "Select an option"}
          </option>
          {field.options?.map((option, index) => (
            <option
              key={index}
              value={option.value}
              className="bg-black text-white"
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
