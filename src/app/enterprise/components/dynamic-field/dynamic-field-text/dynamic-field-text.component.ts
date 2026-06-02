import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UnsubscriberBase } from '@components/api/unsubscribe/unsubscribe';

@Component({
  selector: 'app-dynamic-field-text',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-field-text.component.html',
  styleUrls: ['./dynamic-field-text.component.scss']
})
export class DynamicFieldTextComponent extends UnsubscriberBase implements OnInit {
  @Input() field!: any;
  @Input() formGroup!: FormGroup;

  ngOnInit(): void {
		const control = this.formGroup.get(this.field.field);

		if (control) {
			if (this.field.validator?.number) {
				const maxDecimal = this.field.validator.decimal ?? 0;
				control.addValidators(this.decimalLengthValidator(maxDecimal));
				control.updateValueAndValidity({ emitEvent: false });

				this.subs.sink = control.valueChanges.subscribe(val => {
					if (val === null || val === undefined || val === '') return;
					const str = String(val);
					if (str.includes('.')) {
						const parts = str.split('.');
						if (parts[1].length > maxDecimal) {
							const fixed = parts[0] + '.' + parts[1].substring(0, maxDecimal);
							control.setValue(fixed, { emitEvent: false });
						}
					}
				});
			}
		}
	}

  private decimalLengthValidator(maxDecimal: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') return null;

      const strValue = String(value).trim();

      const numberRegex = /^-?\d*\.?\d*$/;
      if (!numberRegex.test(strValue) || isNaN(Number(strValue))) {
        return { 'notANumber': true };
      }

      if (strValue.includes('.')) {
        const decimalPart = strValue.split('.')[1];
        if (decimalPart.length > maxDecimal) {
          return { 'maxDecimal': true };
        }
      }

      return null;
    };
  }

  public get hasError(): boolean {
    const control = this.formGroup.get(this.field.field);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }
}