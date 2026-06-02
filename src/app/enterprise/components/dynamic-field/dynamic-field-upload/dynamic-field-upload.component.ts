import { Component, Input, OnInit, ViewChild, ElementRef, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicFieldUpload } from './dynamic-field-upload.component.interface';
import { UnsubscriberBase } from '@components/api/unsubscribe/unsubscribe';

const DEFAULT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

@Component({
  selector: 'app-dynamic-field-upload',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-field-upload.component.html',
  styleUrls: ['./dynamic-field-upload.component.scss'],
})
export class DynamicFieldUploadComponent extends UnsubscriberBase implements OnInit, OnChanges  {
  @Input() public field!: DynamicFieldUpload;
  @Input() public formGroup!: FormGroup;

  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;

  public previewUrl: string | null = null;
  public isDragOver: boolean = false;

	public constructor(private readonly cdr: ChangeDetectorRef) {
		super();
	}

  private get extensions(): string[] {
    return this.field.acceptedExtensions?.length
      ? this.field.acceptedExtensions
      : DEFAULT_EXTENSIONS;
  }

  public get acceptAttr(): string {
    return this.extensions.map(e => `.${e}`).join(',');
  }

  public get acceptLabel(): string {
    return this.extensions.map(e => e.toUpperCase()).join(', ');
  }

	public ngOnInit(): void {
		const control = this.formGroup.get(this.field.field);
		if (control) {
			control.addValidators(this.fileTypeValidator(this.extensions));
			control.updateValueAndValidity({ emitEvent: false });

			this.subs.sink = control.valueChanges.subscribe((value: string | null) => {
				if (value) {
					this.previewUrl = value.startsWith('data:') ? value : `data:image/jpeg;base64,${value}`;
				} else {
					this.previewUrl = null;
				}
				this.cdr.markForCheck();
			});

			const currentValue = control.value;
			if (currentValue) {
				this.previewUrl = currentValue.startsWith('data:') ? currentValue : `data:image/jpeg;base64,${currentValue}`;
			}
		}
	}

	public ngOnChanges(): void {
		const control = this.formGroup?.get(this.field?.field);
		const value = control?.value;
		if (value) {
			this.previewUrl = value.startsWith('data:') ? value : `data:image/jpeg;base64,${value}`;
		}
	}

  public onAreaClick(): void {
    if (this.field.disabled) return;
    this.fileInput.nativeElement.click();
  }

  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.processFile(input.files[0]);
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.field.disabled) return;
    this.isDragOver = true;
  }

  public onDragLeave(): void {
    this.isDragOver = false;
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (this.field.disabled) return;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.processFile(file);
  }

  public onRemove(event: MouseEvent): void {
    event.stopPropagation();
    if (this.field.disabled) return;
    this.previewUrl = null;
    this.fileInput.nativeElement.value = '';
    const control = this.formGroup.get(this.field.field);
    control?.setValue(null);
    control?.markAsDirty();
  }

	private processFile(file: File): void {
		const control = this.formGroup.get(this.field.field);
		const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

		if (!this.extensions.includes(ext)) {
			control?.setValue(null);
			control?.setErrors({ invalidType: true });
			control?.markAsDirty();
			this.previewUrl = null;
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			const base64 = result.includes(',') ? result.split(',')[1] : result;
			control?.setValue(base64);
			control?.markAsDirty();
			this.previewUrl = result;
		};
		reader.readAsDataURL(file);
	}

	private fileTypeValidator(extensions: string[]): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;
			if (!value || typeof value !== 'string') return null;
			return null;
		};
	}
}