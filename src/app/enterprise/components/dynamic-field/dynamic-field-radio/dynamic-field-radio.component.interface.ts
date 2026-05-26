import { DynamicFieldBase } from "../dynamic-field.component.interface";

export interface DynamicFieldRadioOption {
  id: string;
  text: string;
}

export interface DynamicFieldRadio extends DynamicFieldBase {
  type: 'radio';
  field: string;
  label?: string;
  options: DynamicFieldRadioOption[];
  validator?: {
    required?: boolean;
    requiredMessage?: string;
  };
	defaultValue?: string | null;
  disabled?: boolean;
}