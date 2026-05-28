import { Component, Input, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from './click.outside.directive.component';
import { DynamicFieldDate } from './dynamic-field-date.component.interface';

export interface CalendarDay {
  date: number;
  fullDate: Date;
  otherMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-dynamic-field-date',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ClickOutsideDirective],
  templateUrl: './dynamic-field-date.component.html',
  styleUrls: ['./dynamic-field-date.component.scss']
})
export class DynamicFieldDateComponent implements OnInit {
  @Input() field!: DynamicFieldDate;
  @Input() formGroup!: FormGroup;

  public isOpen: boolean = false;
  public viewMonth: number = new Date().getMonth();
  public viewYear: number = new Date().getFullYear();
  public calendarDays: CalendarDay[] = [];
  public selectedDate: Date | null = null;

	public get displayValue(): string {
		const val = this.formGroup.get(this.field.field)?.value;
		if (!val) return '';
		const date = new Date(val);
		if (isNaN(date.getTime())) return '';
		const day   = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year  = this.field.dateFormat === 'BE' ? date.getFullYear() + 543 : date.getFullYear();
		return `${day}/${month}/${year}`;
	}

  public readonly monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  public readonly dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];

	constructor(private cdr: ChangeDetectorRef) {}
	 
  ngOnInit(): void {
		const control = this.formGroup.get(this.field.field);

		if (control?.value) {
			this.setSelectedDate(new Date(control.value));
		}

		this.formGroup.statusChanges.subscribe(() => {
			const val = control?.value;
			if (val) {
				const d = new Date(val);
				if (!isNaN(d.getTime())) {
					this.setSelectedDate(d);
					this.cdr.detectChanges();
				}
			} else {
				this.selectedDate = null;
				this.cdr.detectChanges();
			}
		});

		control?.valueChanges.subscribe(val => {
			if (val) {
				this.setSelectedDate(new Date(val));
			} else {
				this.selectedDate = null;
			}
			this.cdr.detectChanges();
		});
	}

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    this.closeCalendar();
  }

  public toggleCalendar(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.buildCalendar();
  }

  public closeCalendar(): void {
    this.isOpen = false;
    this.formGroup.get(this.field.field)?.markAsDirty();
  }

  public prevMonth(): void {
    if (this.viewMonth === 0) { this.viewMonth = 11; this.viewYear--; }
    else this.viewMonth--;
    this.buildCalendar();
  }

  public nextMonth(): void {
    if (this.viewMonth === 11) { this.viewMonth = 0; this.viewYear++; }
    else this.viewMonth++;
    this.buildCalendar();
  }

  public prevYear(): void { this.viewYear--; this.buildCalendar(); }
  public nextYear(): void { this.viewYear++; this.buildCalendar(); }

	public selectDay(day: CalendarDay): void {
    this.setSelectedDate(day.fullDate);
    const iso = this.toISODate(day.fullDate);
    
    this.formGroup.get(this.field.field)?.setValue(iso); 
    
    this.formGroup.get(this.field.field)?.markAsDirty();
    this.closeCalendar();
  }

  public selectToday(): void {
    const today = new Date();
    this.setSelectedDate(today);

    this.formGroup.get(this.field.field)?.setValue(this.toISODate(today)); 
    
    this.formGroup.get(this.field.field)?.markAsDirty();
    this.closeCalendar();
  }

  public clearDate(): void {
    this.selectedDate = null;
    
    this.formGroup.get(this.field.field)?.setValue(null); 
    
    this.formGroup.get(this.field.field)?.markAsDirty();
    this.closeCalendar();
  }

	private setSelectedDate(date: Date): void {
		this.selectedDate = date;
		this.viewMonth = date.getMonth();
		this.viewYear = date.getFullYear();
		this.buildCalendar();
	}
  public buildCalendar(): void {
    const days: CalendarDay[] = [];
    const today = new Date();
    const firstDay = new Date(this.viewYear, this.viewMonth, 1);
    const lastDay  = new Date(this.viewYear, this.viewMonth + 1, 0);

    // padding days from prev month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const d = new Date(this.viewYear, this.viewMonth, -firstDay.getDay() + i + 1);
      days.push(this.makeDay(d, true, today));
    }

    // current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(this.viewYear, this.viewMonth, i);
      days.push(this.makeDay(d, false, today));
    }

    // padding days from next month
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(this.viewYear, this.viewMonth + 1, i);
      days.push(this.makeDay(d, true, today));
    }

    this.calendarDays = days;
  }

  private makeDay(d: Date, otherMonth: boolean, today: Date): CalendarDay {
    return {
      date: d.getDate(),
      fullDate: d,
      otherMonth,
      isToday: this.sameDay(d, today),
      isSelected: this.selectedDate ? this.sameDay(d, this.selectedDate) : false,
    };
  }

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth()    === b.getMonth()
        && a.getDate()     === b.getDate();
  }

  private toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  public get hasError(): boolean {
    const control = this.formGroup.get(this.field.field);
    return !!(control?.invalid && control?.dirty);
  }
}