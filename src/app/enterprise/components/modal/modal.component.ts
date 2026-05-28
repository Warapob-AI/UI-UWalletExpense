import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
	ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ModalConfig } from './modal.component.interface';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, DynamicFieldComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  @Input() config!: ModalConfig;

  // เปิด/ปิดจากภายนอกผ่าน isOpen
  @Input() isOpen: boolean = false;

  // Events
  @Output() confirmed = new EventEmitter<FormGroup | null>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() formGroupField = new EventEmitter<FormGroup>();

	constructor(private cdr: ChangeDetectorRef) {}
	
  private formGroup: FormGroup | null = null;

  public onFormGroup(fg: FormGroup): void {
    this.formGroup = fg;
    this.formGroupField.emit(fg);
  }

  public onConfirm(): void {
    this.confirmed.emit(this.formGroup);
    this.isOpen = false;
    this.closed.emit();
  }

  public onCancel(): void {
    this.cancelled.emit();
    this.close();
  }

  public onBackdropClick(event: MouseEvent): void {
    // ปิดเมื่อคลิก backdrop (ไม่ใช่ container)
    this.close();
  }

	public open(): void {
		this.isOpen = true;
		this.cdr.markForCheck();
	}

	public close(): void {
		this.isOpen = false;
		this.cdr.markForCheck();
		this.closed.emit();
	}
	}