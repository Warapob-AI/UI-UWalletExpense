import { DynamicField } from '../dynamic-field/dynamic-field.component.interface';

export interface ModalConfig {
  title: string;
  width?: string;         // default '520px'
  confirmLabel?: string;  // default 'Confirm'
  cancelLabel?: string;   // default 'Cancel'
  dynamicField?: DynamicField[];
  hideFooter?: boolean;
}