import { FormInput } from "@/app/Models/FormInputs";

export interface DynamicFormProps {
  fields: FormInput[];
  className?: string;
  onSubmit: (data: Record<string, any>) => void;
  buttonTitle?: string;
  buttonClassName?: string;
  uploaderNote?: string;
  uploaderNoteClass?: string;
  uploaderPlaceholder?: string;
}
