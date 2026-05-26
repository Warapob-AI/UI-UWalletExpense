import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFieldText } from './dynamic-field-text.component.interface';

@Component({
  selector: 'app-dynamic-field-text',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-field-text.component.html',
	styleUrls: ['./dynamic-field-text.component.scss']
})
export class DynamicFieldTextComponent {
  @Input() field!: DynamicFieldText;
  @Input() formGroup!: FormGroup;
}