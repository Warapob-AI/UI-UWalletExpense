import { Component, Input } from '@angular/core';
import { DynamicFieldLogoAndText } from './dynamic-field-logo-and-text.component.interface';

@Component({
  selector: 'app-dynamic-field-logo-and-text',
  standalone: true,
  templateUrl: './dynamic-field-logo-and-text.component.html',
  styleUrls: ['./dynamic-field-logo-and-text.component.scss']
})
export class DynamicFieldLogoAndTextComponent {
  @Input() field!: DynamicFieldLogoAndText;
}