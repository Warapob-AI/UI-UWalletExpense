import { DynamicFieldBase } from "../dynamic-field.component.interface";
import { DynamicFieldValidator } from "../dynamic-field-text/dynamic-field-text.component.interface";

/**
 * Date input field
 * @param type - 'date'
 * @param label - Label text above input
 * @param dateFormat - 'AD' (default) | 'BE' — display only, value stored as AD always
 *
 * @example
 * {
 *   type: 'date',
 *   field: 'debt_start_date',
 *   fieldColumn: 3,
 *   label: 'Start Date',
 *   dateFormat: 'BE',
 *   validator: { required: true },
 * }
 */
export interface DynamicFieldDate extends DynamicFieldBase {
  type: 'date';
  field: string;
  label: string;
  dateFormat?: 'AD' | 'BE';
  disabled?: boolean;
  validator?: DynamicFieldValidator;
}