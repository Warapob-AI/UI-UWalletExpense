import { DynamicFieldBase } from "../dynamic-field.component.interface";

export interface DynamicFieldValidator {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  requiredMessage?: string;
  minLengthMessage?: string;
  maxLengthMessage?: string;
  emailMessage?: string;
}

/**
 * Text / Password input field
 * @param type - 'text' | 'password'
 * @param label - Label text above input
 * @param placeholder - Placeholder text inside input
 * 
 * @example
 * // Text input
 * {
 *   type: 'text',
 *   fieldColumn: 12,
 *   label: 'Username',
 *   placeholder: 'Enter username',
 * }
 * 
 * // Password input
 * {
 *   type: 'password',
 *   fieldColumn: 12,
 *   label: 'Password',
 *   placeholder: 'Enter password',
 * }
 */
export interface DynamicFieldText extends DynamicFieldBase {
  type: 'text' | 'password' ;
  field: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  validator?: DynamicFieldValidator;
}
