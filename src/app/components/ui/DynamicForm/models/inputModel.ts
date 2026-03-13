import { FormInput } from "@/app/Models/FormInputs";

export interface InputProps {
  field: FormInput;
  value: any;
  className?: string;
  uploaderNote?: string;
  uploaderNoteClass?: string;
  uploaderPlaceholder?: string;
  error?: string;
  onChange: (name: string, value: any) => void;
}
