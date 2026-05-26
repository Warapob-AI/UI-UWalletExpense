import { DynamicFieldBase } from "../dynamic-field.component.interface";

/**
 * Logo and text field
 * @param type - 'logo-and-text'
 * @param src - Path to logo image
 * @param label - Text to display below logo
 * @param width - Logo width in px (optional, default: auto)
 * @param fontWeight - Font weight of label (optional, default: 400)
 * 
 * @example
 * {
 *   type: 'logo-and-text',
 *   fieldColumn: 12,
 *   src: '/assets/images/auth/logo.png',
 *   label: 'UWalletExpense',
 *   width: 80,
 *   fontWeight: 700,
 * }
 */
export interface DynamicFieldLogoAndText extends DynamicFieldBase {
	type: 'logo-and-text';
	src: string;
	label: string;
	width?: number;
	fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

/**
 * Union type of all dynamic fields
 * 
 * @example
 * const fields: DynamicField[] = [
 *   {
 *     type: 'logo-and-text',
 *     fieldColumn: 12,
 *     src: '/assets/images/auth/logo.png',
 *     label: 'UWalletExpense',
 *     fontWeight: 700,
 *   },
 *   {
 *     type: 'text',
 *     fieldColumn: 12,
 *     label: 'Username',
 *     placeholder: 'Enter username',
 *   },
 *   {
 *     type: 'password',
 *     fieldColumn: 12,
 *     label: 'Password',
 *     placeholder: 'Enter password',
 *   },
 * ];
 */
