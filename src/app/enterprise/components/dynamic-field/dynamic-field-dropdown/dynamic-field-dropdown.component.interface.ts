import { DynamicFieldBase } from '../dynamic-field.component.interface';

export interface DynamicFieldDropdown extends DynamicFieldBase {
  type: 'dropdown';
  field: string;
  label: string;
  placeholder?: string;
  url?: string;
  search?: Record<string, any>;
  orderBy?: Record<string, string>;
  valueField?: string;
  labelField?: string;
  options?: { id: any; text: string }[];
  validator?: {
    required?: boolean;
    requiredMessage?: string;
  };
}