import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicField } from './dynamic-field.component.interface';
import { DynamicFieldText } from './dynamic-field-text/dynamic-field-text.component.interface'
import { Validators } from '@angular/forms';
import { DynamicFieldButtonComponent } from './dynamic-field-button/dynamic-field-button.component';
import { DynamicFieldTextComponent } from './dynamic-field-text/dynamic-field-text.component';
import { DynamicFieldLogoAndTextComponent } from './dynamic-field-logo-and-text/dynamic-field-logo-and-text.component';
import { DynamicFieldRadioComponent } from './dynamic-field-radio/dynamic-field-radio.component';
import { DynamicFieldRadio } from './dynamic-field-radio/dynamic-field-radio.component.interface';
import { DynamicFieldDropdownComponent } from './dynamic-field-dropdown/dynamic-field-dropdown.component';
import { DynamicFieldDropdown } from './dynamic-field-dropdown/dynamic-field-dropdown.component.interface';
import { DynamicFieldDate } from './dynamic-field-date/dynamic-field-date.component.interface';
import { DynamicFieldDateComponent } from './dynamic-field-date/dynamic-field-date.component';
import { DynamicFieldUploadComponent } from './dynamic-field-upload/dynamic-field-upload.component';
import { DynamicFieldUpload } from './dynamic-field-upload/dynamic-field-upload.component.interface';

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    DynamicFieldTextComponent, 
    DynamicFieldButtonComponent, 
    DynamicFieldLogoAndTextComponent, 
    DynamicFieldRadioComponent, 
    DynamicFieldDropdownComponent,
		DynamicFieldDateComponent,
		DynamicFieldUploadComponent,
  ],
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.scss'],
})
export class DynamicFieldComponent implements OnInit {
  @Input() dynamicField!: DynamicField[];
  @Output() formGroupField = new EventEmitter<FormGroup>();

  public formGroup!: FormGroup;

  constructor(
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
	) {}

  ngOnInit() {
    const controls: any = {};

    this.dynamicField.forEach(field => {
			if (field.type === 'text' || field.type === 'password') {
        const f = field as DynamicFieldText;
        const validators = [];
        const v = f.validator;

        if (v?.required) validators.push(Validators.required);
        if (v?.minLength) validators.push(Validators.minLength(v.minLength));
        if (v?.maxLength) validators.push(Validators.maxLength(v.maxLength));
        if (v?.email) validators.push(Validators.email);

        controls[f.field] = [{ value: '', disabled: !!f.disabled }, validators];
      }

      if (field.type === 'radio') {
        const f = field as DynamicFieldRadio;
        const validators = [];

        if (f.validator?.required) validators.push(Validators.required);

        controls[f.field] = ['', validators];
      }

      if (field.type === 'dropdown') {
        const f = field as DynamicFieldDropdown;
        const validators = [];
        if (f.validator?.required) validators.push(Validators.required);
        controls[f.field] = ['', validators];
      }

			if (field.type === 'date') {
				const f = field as DynamicFieldDate;
				const validators = [];
				if (f.validator?.required) validators.push(Validators.required);
				controls[f.field] = [null, validators];
			}

			if (field.type === 'upload') {
				const f = field as DynamicFieldUpload;
				const validators = [];
				if (f.validator?.required) validators.push(Validators.required);
				controls[f.field] = [null, validators];
			}

    });

    this.formGroup = this.fb.group(controls);
  }

	 ngAfterViewInit() {
		this.formGroupField.emit(this.formGroup);
		this.cdr.detectChanges();
	 }
}