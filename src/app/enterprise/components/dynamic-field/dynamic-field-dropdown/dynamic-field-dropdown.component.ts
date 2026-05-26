import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DynamicFieldDropdown } from './dynamic-field-dropdown.component.interface';

@Component({
  selector: 'app-dynamic-field-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-field-dropdown.component.html',
  styleUrls: ['./dynamic-field-dropdown.component.scss']
})
export class DynamicFieldDropdownComponent implements OnInit {
  @Input() field!: DynamicFieldDropdown;
  @Input() formGroup!: FormGroup;

  public options: { id: any; text: string }[] = [];
  public isLoading: boolean = false;

  constructor(
		private http: HttpClient,
		private cdr: ChangeDetectorRef,
	) {}

  public ngOnInit(): void {
    if (this.field.options?.length) {
      this.options = this.field.options;
    } else if (this.field.url) {
      this.loadOptions();
    }
  }

  private loadOptions(): void {
    if (!this.field.url) return;

    this.isLoading = true;

    const params: any = {
      page: 1,
      pageSize: undefined,
      orderBy: JSON.stringify(this.field.orderBy ?? {}),
      search: JSON.stringify(this.field.search ?? {}),
    };

    this.http.post<any>(this.field.url, params).subscribe({
      next: (res) => {
				const rows = Array.isArray(res) ? res : res.data;
				this.options = rows.map((row: any) => ({
					id:   row[this.field.valueField ?? 'id'],
					text: row[this.field.labelField ?? 'name'],
				}));
				this.isLoading = false;
				this.cdr.detectChanges();
			},
			error: () => {
				this.isLoading = false;
				this.cdr.detectChanges();
			}
    });
  }
}