import { OptionInfo } from "@/app/Models/OptionInfo";
import { ValidatorInfo } from "@/app/Models/ValidatorsInfo";

export interface FormInput {
  uploaderPlaceholder?: string | undefined;
  uploaderNoteClass?: string | undefined;
  uploaderNote?: string | undefined;
  wrapperClass?: string;  
  labelClass?: string;
  inputClass?: string;    
  className?: string;
  modelName: string;
  label?: string;
  placeholder?: string;
  type: string;
  options?: OptionInfo[];
  validators?: ValidatorInfo[];
  menuWidthClass?: string;
  value?: any | any[];
  colSpan?: number;
}
