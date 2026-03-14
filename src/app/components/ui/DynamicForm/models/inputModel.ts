import { FormInput } from "@/app/Models/FormInputs";

export interface InputProps {
  field: FormInput;
  value: any;
  className?: string;

  wrapperClass?: string;
  labelClass?: string;
  inputClass?: string;

  uploaderNote?: string;
  uploaderNoteClass?: string;
  uploaderPlaceholder?: string;
  error?: string;
  onChange: (name: string, value: any) => void;
}
