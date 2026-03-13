import React from "react";
import { InputProps } from "../models/inputModel"; // Adjust the path accordingly
import { Input } from "../../input/input";

const CheckboxInput: React.FC<InputProps> = ({ field, value, onChange }) => {
  return (
    <div className={`flex items-center gap-4 ${field.className}`}>
      <Input
        type="checkbox"
        id={field.modelName}
        name={field.modelName}
        checked={value === "true"} // Check if value is 'true'
        onChange={(e) =>
          onChange(field.modelName, e.target.checked ? "true" : "false")
        }
        className="h-6 w-auto rounded-full"
      />
      {field.label}
    </div>
  );
};

export default CheckboxInput;
