import { DynamicFieldButton } from './dynamic-field-button/dynamic-field-button.component.interface';
import { DynamicFieldDropdown } from './dynamic-field-dropdown/dynamic-field-dropdown.component.interface';
import { DynamicFieldLogoAndText } from './dynamic-field-logo-and-text/dynamic-field-logo-and-text.component.interface';
import { DynamicFieldRadio } from './dynamic-field-radio/dynamic-field-radio.component.interface';
import { DynamicFieldText } from './dynamic-field-text/dynamic-field-text.component.interface';
import { DynamicFieldEmpty } from './dynamic-field-empty/dynamic-field-empty.component.interface';
import { DynamicFieldDate } from './dynamic-field-date/dynamic-field-date.component.interface';

/**
 * Base interface for all dynamic fields
 * @param fieldColumn - Number of columns to span (1-12) like Bootstrap grid
 * 
 * @example
 * fieldColumn: 12  // full width
 * fieldColumn: 6   // half width
 * fieldColumn: 4   // one-third width
 */
export interface DynamicFieldBase {
  type: string;
  field?: string;
  fieldColumn?: number;      
  fieldColumnStart?: number; 
  fieldColumnEnd?: number;   
  hide?: boolean;            
}

export type DynamicField = DynamicFieldLogoAndText | 
DynamicFieldText | 
DynamicFieldButton | 
DynamicFieldRadio | 
DynamicFieldDropdown | 
DynamicFieldEmpty | 
DynamicFieldDate;