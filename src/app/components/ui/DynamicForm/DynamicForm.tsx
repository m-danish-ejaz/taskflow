import React, { useState } from "react";
import CheckboxInput from "./CheckBoxInput/CheckBoxInput";
import RadioInput from "./RadioInput/RadioInput";
import { Button } from "@/app/components/ui/button/button";
import { DynamicFormProps } from "./models/DynamicFormProps";
import FileInput from "./InputFile/InputFile";
import TextArea from "./TextArea/TextArea";
import TextInput from "./TextInput/TextInput";
import SelectInput from "./SelectInput/selectInput";

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  className,
  onSubmit,
  buttonTitle = "Send Message",
  buttonClassName,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Validate the field on change
    const field = fields.find((f) => f.modelName === name);
    if (field?.validators) {
      for (const validator of field.validators) {
        if (validator.type === "required" && !value) {
          setErrors((prev) => ({ ...prev, [name]: validator.message }));
          return;
        }
        if (
          validator.type === "minLength" &&
          typeof validator.value === "number" &&
          value.length < validator.value
        ) {
          setErrors((prev) => ({ ...prev, [name]: validator.message }));
          return;
        }
        if (
          validator.type === "maxLength" &&
          typeof validator.value === "number" &&
          value.length > validator.value
        ) {
          setErrors((prev) => ({ ...prev, [name]: validator.message }));
          return;
        }
        if (
          validator.type === "pattern" &&
          validator.value instanceof RegExp &&
          !validator.value.test(value)
        ) {
          setErrors((prev) => ({ ...prev, [name]: validator.message }));
          return;
        }
      }
      setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error if valid
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submitting
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const value = formData[field.modelName];
      field.validators?.forEach((validator) => {
        if (validator.type === "required" && !value) {
          newErrors[field.modelName] = validator.message;
        }
        if (
          validator.type === "minLength" &&
          typeof validator.value === "number" &&
          value?.length < validator.value
        ) {
          newErrors[field.modelName] = validator.message;
        }
        if (
          validator.type === "pattern" &&
          validator.value instanceof RegExp &&
          !validator.value.test(value)
        ) {
          newErrors[field.modelName] = validator.message;
        }
      });
    });

    setErrors(newErrors);
    console.log("Validation Errors:", newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col rounded-2xl p-6 gap-4 ${className}`}
    >
      {fields.map((field) => {
        const value =
          formData[field.modelName] || (field.type === "checkbox" ? [] : "");
        const error = errors[field.modelName];

        switch (field.type) {
          case "text":
          case "password":
          case "email":
          case "date":
            return (
              <TextInput
                key={field.modelName}
                field={field}
                value={value}
                onChange={handleChange}
                error={error}
                className={field.className}
              />
            );
          case "number":
            return ( 
              <TextInput
                key={field.modelName}
                field={field}
                value={value}
                onChange={handleChange}
                error={error}
                className={field.className}
              />
            );
          case "checkbox":
            return (
              <CheckboxInput
                key={field.modelName}
                field={field}
                value={value}
                onChange={handleChange}
                className={field.className}
              />
            );
          case "radio":
            return (
              <RadioInput
                key={field.modelName}
                field={field}
                value={value}
                onChange={handleChange}
                className={field.className}
              />
            );
          case "textarea":
            return (
              <TextArea
                key={field.modelName}
                field={field}
                value={value}
                onChange={handleChange}
                error={error}
                className={field.className}
              />
            );
          case "file":
            return (
              <FileInput
                key={field.modelName}
                field={field}
                value={value}
                onChange={handleChange}
                className={field.className}
                uploaderNote={field.uploaderNote}
                uploaderNoteClass={field.uploaderNoteClass}
                uploaderPlaceholder={field.uploaderPlaceholder}
                error={error}
              />
            );
          case "select":
            return (
              <SelectInput
                key={field.modelName}
                field={field}
                value={value}
                onChange={handleChange}
                error={error}
                className={field.className}
              />
            );
          default:
            return null;
        }
      })}

      <div className="flex col-span-full justify-center">
        <Button type="submit" className={buttonClassName}>
          {buttonTitle}
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm;
