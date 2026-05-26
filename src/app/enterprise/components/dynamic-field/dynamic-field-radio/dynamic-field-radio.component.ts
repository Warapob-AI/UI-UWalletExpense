import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFieldRadio } from './dynamic-field-radio.component.interface';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-dynamic-field-radio',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],               
  templateUrl: './dynamic-field-radio.component.html',
  styleUrls: ['./dynamic-field-radio.component.scss']
})
export class DynamicFieldRadioComponent implements OnInit {
  @Input() field!: DynamicFieldRadio;
  @Input() formGroup!: FormGroup;

	ngOnInit(): void {
		const ctrl = this.formGroup.get(this.field.field);
		if (!ctrl) { return; }

		if (this.field.defaultValue && !ctrl.value) {
			ctrl.setValue(this.field.defaultValue);
		}

		if (this.field.disabled) {
			ctrl.disable({ emitEvent: false });
		}
	}
}