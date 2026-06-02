/**
 * Validator configuration for the upload field.
 *
 * @interface DynamicFieldUploadValidator
 *
 * @property {boolean} [required]
 *   Whether the field is required.
 *   Usage: Adds Validators.required to the form control.
 *   Example: true
 *
 * @property {string} [requiredMessage]
 *   Custom error message shown when required validation fails.
 *   Usage: Overrides the default 'This field is required' message.
 *   Example: "Please upload a file"
 */
export interface DynamicFieldUploadValidator {
  required?: boolean;
  requiredMessage?: string;
}

/**
 * Configuration for the dynamic upload field component.
 *
 * @interface DynamicFieldUpload
 *
 * @property {'upload'} type
 *   Field type identifier. Must be 'upload' to render this component.
 *   Usage: Used in the parent dynamic-field switch to select this component.
 *   Example: "upload"
 *
 * @property {string} field
 *   The FormGroup control name this field binds to.
 *   Usage: Must match the key registered in the parent FormGroup.
 *   Example: "profileImage"
 *
 * @property {string} label
 *   Human-readable label displayed above the upload area.
 *   Usage: Shown in the label zone with an asterisk if required.
 *   Example: "Profile Picture"
 *
 * @property {string[]} [acceptedExtensions]
 *   List of allowed file extensions (without dot, lowercase).
 *   Usage: Used to build the accept attribute and validate on file selection.
 *   If omitted, defaults to ['jpg', 'jpeg', 'png', 'gif', 'webp'].
 *   Example: ['jpg', 'png']
 *
 * @property {boolean} [disabled]
 *   Whether the upload area is disabled.
 *   Usage: Prevents file selection when true.
 *   Example: false
 *
 * @property {DynamicFieldUploadValidator} [validator]
 *   Validation rules for this field.
 *   Usage: Defines required and custom error messages.
 *   Example: { required: true, requiredMessage: 'Please upload a profile image' }
 *
 * @property {number} [fieldColumn]
 *   Grid column span for layout in the parent dynamic-form-container.
 *   Usage: Sets CSS --grid-span variable on the wrapper element.
 *   Example: 2
 *
 * @property {number} [fieldColumnStart]
 *   Grid column start position.
 *   Usage: Sets CSS --grid-start variable on the wrapper element.
 *   Example: 1
 *
 * @property {number} [fieldColumnEnd]
 *   Grid column end position.
 *   Usage: Sets CSS --grid-end variable on the wrapper element.
 *   Example: 3
 *
 * @property {boolean} [hide]
 *   Whether to hide this field from the form.
 *   Usage: When true, the parent dynamic-field skips rendering this field.
 *   Example: false
 */
export interface DynamicFieldUpload {
  type: 'upload';
  field: string;
  label: string;
  acceptedExtensions?: string[];
  disabled?: boolean;
  validator?: DynamicFieldUploadValidator;
  fieldColumn?: number;
  fieldColumnStart?: number;
  fieldColumnEnd?: number;
  hide?: boolean;
}