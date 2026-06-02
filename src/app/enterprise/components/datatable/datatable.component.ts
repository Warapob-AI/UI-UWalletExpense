import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DatatableConfig, DatatableActionEvent, DatatableColumn } from './datatable.component.interface';
import { Subscription } from 'rxjs';
import { UnsubscriberBase } from '@components/api/unsubscribe/unsubscribe';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss',
})
export class DatatableComponent extends UnsubscriberBase implements OnInit, OnChanges {
	// Input
  @Input() config!: DatatableConfig;

	// Output
  @Output() datatableAction = new EventEmitter<DatatableActionEvent>();
	@Output() addClicked = new EventEmitter<void>();
	@Output() clearClicked = new EventEmitter<void>();

	// Property
  public data: any[] = [];
  public total: number = 0;
	// Boolean
  public isLoading: boolean = false;

  // pagination
  public currentPage: number = 1;
  public pageSize: number = 10;

  // sort
  public sortField: string = '';
  public sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
		private http: HttpClient,
		private cdr: ChangeDetectorRef
	) {
		super();
	}

	// Action helpers
	get hasActions(): boolean {
		return !!this.config?.action?.length;
	}

	hasAction(type: 'Edit' | 'Delete' | 'Approve' | 'View'): boolean {
		return this.config?.action?.some(a => a.type === type) ?? false;
	}

	get actionColumnWidth(): number {
		const actions = this.config?.action ?? [];
		const actionCol = this.config.columns.find(c => c.type === 'action');
		if (actionCol?.width) return actionCol.width;
		return actions.reduce((sum, a) => sum + (a.width ?? 40), 0) + 16;
	}

	get totalColumns(): number {
		const dataCols = this.config.columns.filter(c => c.type !== 'action').length;
		return dataCols + (this.hasActions ? 1 : 0);
	}

	getFieldKey(col: DatatableColumn): string {
		return Array.isArray(col.field) ? col.field[0] : (col.field ?? '');
	}

	// Summary helpers
	get hasSummary(): boolean {
		return this.config.columns.some(c => c.type === 'number' && c.summary);
	}

	getSummary(col: DatatableColumn): string {
		const field = Array.isArray(col.field) ? col.field[0] : col.field;
		if (!field) return '';
		const sum = this.data.reduce((acc, row) => acc + (Number(row[field]) || 0), 0);
		const decimal = col.decimal ?? 2;
		return sum.toLocaleString('th-TH', {
			minimumFractionDigits: decimal,
			maximumFractionDigits: decimal,
		});
	}

  public ngOnInit(): void {
    if (this.config?.footer?.pageSize) {
      this.pageSize = this.config.footer.pageSize;
    }
    this.loadData();
  }

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['config'] && !changes['config'].firstChange) {
			this.currentPage = 1;
			this.loadData();
		}
	}

  public loadData(): void {
    if (!this.config?.url) return;

    this.isLoading = true;

    const orderBy: Record<string, string> = {};
    if (this.sortField) {
      orderBy[this.sortField] = this.sortDirection;
    } else if (this.config.orderBy) {
      Object.assign(orderBy, this.config.orderBy);
    }

		const params: any = {
			orderBy: JSON.stringify(orderBy),
			search: JSON.stringify(this.config.search ?? {}),
		};

		if (this.config.getAll) {
			params['getAll'] = true;
		} else {
			params['page'] = this.currentPage;
			params['pageSize'] = this.pageSize;
		}

		if (this.config.scrollLimitsRow && !this.config.getAll) {
			params['limit'] = this.config.scrollLimitsRow;
		}

    this.subs.sink = this.http.post<any>(this.config.url, params).subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.data = res;
          this.total = res.length;
        } else {
          this.data = res?.data ?? [];
          this.total = res?.total ?? 0;
        }
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  public onSort(column: DatatableColumn): void {
		if (!column.sortable || !column.field) return;
		
		const field = Array.isArray(column.field) ? column.field[0] : column.field;
		if (!field) return;

		if (this.sortField === field) {
			this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortField = field;
			this.sortDirection = 'asc';
		}

		this.currentPage = 1;
		this.loadData();
	}

	public goToPage(page: number): void {
		if (page < 1 || page > this.totalPages) return;
		this.currentPage = page;
		this.loadData();
	}


	public getFieldValue(row: any, col: DatatableColumn): string {
		if (!col.field) return '';
		if (Array.isArray(col.field)) {
			return col.field.map(f => row[f] ?? '').join(col.separator ?? ' ');
		}
		return row[col.field] ?? '';
	}

	public formatFieldValue(row: any, col: DatatableColumn): string {
		let value: any;
		if (!col.field) return '';
		if (Array.isArray(col.field)) {
			value = col.field.map(f => row[f] ?? '').join(col.separator ?? ' ');
		} else {
			value = row[col.field] ?? '';
		}

		switch (col.type) {

			case 'number': {
				const num = Number(value);
				if (isNaN(num)) return value;
				const decimal = col.decimal ?? 2;
				return num.toLocaleString('th-TH', {
					minimumFractionDigits: decimal,
					maximumFractionDigits: decimal,
				});
			}

			case 'date': {
				if (!value) return '';
				const date = new Date(value);
				if (isNaN(date.getTime())) return value;
				const day   = String(date.getDate()).padStart(2, '0');
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const year  = col.dateFormat === 'BE'
					? date.getFullYear() + 543
					: date.getFullYear();
				return `${day}/${month}/${year}`;
			}

			case 'status': {
				if (!col.options?.length) return value;
				return col.options.find(o => o.id === value)?.text ?? value;
			}

			default:
				return value;
		}
	}

	public onView(row: any): void {
		this.datatableAction.emit({ action: 'View', row });
	}

  public onEdit(row: any): void {
    this.datatableAction.emit({ action: 'Edit', row });
  }
	
  public onDelete(row: any): void {
    this.datatableAction.emit({ action: 'Delete', row });
  }

	public onApprove(row: any): void {
		this.datatableAction.emit({ action: 'Approve', row });
	}

	public get totalPages(): number {
		if (this.config?.getAll) return 1;
		return Math.ceil(this.total / this.pageSize) || 1;
	}

	public onAddClick(): void {
		this.addClicked.emit();
	}

	public onClearClick(): void {
    this.sortField = '';
    this.sortDirection = 'asc';
    this.currentPage = 1;
    this.clearClicked.emit();
    this.loadData();
  }

	public refresh(): void {
    this.currentPage = 1;
    this.loadData();
  }
}