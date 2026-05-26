import { Component, Input } from '@angular/core';
import { DynamicFieldButton } from './dynamic-field-button.component.interface';

@Component({
  selector: 'app-dynamic-field-button',
  standalone: true,
  templateUrl: './dynamic-field-button.component.html',
  styleUrls: ['./dynamic-field-button.component.scss']
})
export class DynamicFieldButtonComponent {
  @Input() field!: DynamicFieldButton;
}