import { DynamicFieldBase } from '../dynamic-field.component.interface';

/**
 * Button field
 * @param type - 'button'
 * @param label - Text inside button
 * @param variant - Button style => 'primary' | 'secondary' | 'outline'
 * @param positionX - Horizontal alignment (optional, default: 'start')
 * @param width - Button width in % (optional, default: 100)
 * @param onClick - Function event for after click.
 * 
 * @example
 * {
 *   type: 'button',
 *   fieldColumn: 6,
 *   label: 'Login',
 *   variant: 'primary',
 *   positionX: 'center',
 *   width: 80,
 *   onClick: () => this.onLogin(),
 * }
 */
export interface DynamicFieldButton extends DynamicFieldBase {
  type: 'button';
  label: string;
  variant: 'primary' | 'secondary' | 'outline' | 'search' | 'clear' | 'save';
  positionX?: 'start' | 'center' | 'end';
  width?: number;
  icon?: 'search' | 'clear' | 'add' | 'edit' | 'delete' | 'save';
  onClick?: () => void;
}