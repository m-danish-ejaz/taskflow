import React from "react";
import { InputProps } from "../models/inputModel"; // Adjust the path accordingly
import { Input } from "../../input/input";
import { Label } from "../../label/label";

const CheckboxInput: React.FC<InputProps> = ({
  field,
  value,
  onChange,
}) => {
  const isRequired = field.validators?.some(v => v.type === "required");

  return (
    <div className={field.wrapperClass}>
      <Input
        type="checkbox"
        id={field.modelName}
        name={field.modelName}
        checked={value === true || value === "true"}
        onChange={(e) =>
          onChange(field.modelName, e.target.checked)
        }
        className={field.inputClass}
      />
      <Label
        className={field.labelClass}
        htmlFor={field.modelName}
      >
        {field.label} {isRequired && <span className="text-rose-600">*</span>}
      </Label>
    </div>
  );
};

export default CheckboxInput