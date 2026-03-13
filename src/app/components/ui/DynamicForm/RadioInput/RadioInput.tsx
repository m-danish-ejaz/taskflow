import React from "react";
import { InputProps } from "../models/inputModel";

const RadioInput: React.FC<InputProps> = ({ field, value, onChange }) => {
  return (
    <div className={field.className}>
      <label className="font-bold mb-2" htmlFor={field.modelName}>
        {field.label}
      </label>
      <div className="flex flex-col gap-y-3 md:gap-y-0 md:gap-x-6 mt-2">
        {field.options?.map((option: any) => (
          <label
            key={option.value}
            className={`flex items-center cursor-pointer text-gray-700 ${
              value === option.value ? "font-semibold" : ""
            }`}
          >
            <input
              type="radio"
              name={field.modelName}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(field.modelName, e.target.value)}
              className="hidden"
            />
            <div
              className={`w-4 h-4 mr-2 rounded-full border-2 ${
                value === option.value
                  ? "bg-black border-black"
                  : "border-gray-400"
              } flex justify-center items-center`}
            >
              {value === option.value && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioInput;
