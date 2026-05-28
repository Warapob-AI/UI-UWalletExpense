import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BackgroundComponent } from '@components/background/background.component';
import { DatatableComponent } from '@components/datatable/datatable.component';
import { DatatableActionEvent, DatatableConfig } from '@components/datatable/datatable.component.interface';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { UWEBizExpDebtPeriodManagementDTO } from 'src/app/enterprise/biz-dto/UWEExpense/UWEBizExpDebtPeriodManagementDTO';
import { UWEBizExpDebtManagementService } from 'src/app/enterprise/biz-service/UWEExpense/UWEBizExpDebtManagementService';
import { UWEBizExpDebtPeriodManagementService } from 'src/app/enterprise/biz-service/UWEExpense/UWEBizExpDebtPeriodManagementService';
import { environment } from 'src/app/environments/environment';
import { ModalComponent } from '@components/modal/modal.component';
import { ModalConfig } from '@components/modal/modal.component.interface';

@Component({
  selector: 'app-debt-period-management',
  standalone: true,
  imports: [DynamicFieldComponent, BackgroundComponent, DatatableComponent, ModalComponent],
  templateUrl: './debt-period-management.component.html',
  styleUrls: ['./debt-period-management.component.scss']
})
export class DebtPeriodManagementComponent implements OnInit {

  @ViewChild('dataTable') dataTable!: DatatableComponent;
  @ViewChild('modal') modal!: ModalComponent;

  public initDynamicField!: DynamicField[];
  public searchFormGroup!: FormGroup;
	public modalFormGroup!: FormGroup;

  private selectedRow: any = null;

  public urlSelectDebt: string = `${environment.PORT_API_ENTERPRISE_UWEEXPENSE}/exp-debt-period-management/select-debt-period`;

  constructor(
    private readonly uweModalService: UWEModalService,
    private readonly debtService: UWEBizExpDebtManagementService,
    private readonly debtPeriodService: UWEBizExpDebtPeriodManagementService,
  ) {}

  ngOnInit(): void {
    this.initSearchField();
  }

  private initSearchField(): void {
    this.initDynamicField = [
      {
        type: 'text',
        field: 'search_value',
        fieldColumn: 3,
        label: 'Search Value',
        placeholder: 'Debt name / Description',
      },
      {
        type: 'radio',
        field: UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS,
        fieldColumn: 3,
        label: 'Status',
        options: [
          { id: 'P', text: 'Pending' },
          { id: 'C', text: 'Completed' },
          { id: 'O', text: 'Overdue' },
          { id: '', text: 'All' },
        ],
        defaultValue: 'A',
      },
      {
        type: 'button',
        fieldColumn: 1,
        label: 'Search',
        variant: 'search',
        icon: 'search',
        width: 100,
        onClick: () => this.onSearch(),
      },
      {
        type: 'button',
        fieldColumn: 1,
        label: 'Clear',
        variant: 'clear',
        icon: 'clear',
        width: 100,
        onClick: () => this.onClear(),
      },
    ];
  }

  // ─── Datatable ───────────────────────────────────────────

  datatableConfig: DatatableConfig = {
    url: this.urlSelectDebt,
    title: 'Debt Period Management',
    getAll: true,
    search: {
      user_name: sessionStorage.getItem('user_name') || '',
    },
    action: [
      { type: 'Edit' },
      { type: 'Delete' },
    ],
    columns: [
      { type: 'action', width: 100 },
      { type: 'text', field: UWEBizExpDebtPeriodManagementDTO.DEBT_NAME, label: 'Debt Name', sortable: true, width: 20 },
      { type: 'text', field: ['', UWEBizExpDebtPeriodManagementDTO.DEBT_PERIOD], label: 'Debt Period', sortable: true, width: 9, separator: 'งวดที่ ' },
      { type: 'text', field: UWEBizExpDebtPeriodManagementDTO.DEBT_DUE_DATE, label: 'Debt Due Date', sortable: true, width: 9 },
      { type: 'text', field: UWEBizExpDebtPeriodManagementDTO.DEBT_TYPE, label: 'Type', sortable: true, width: 7, summaryTextRight: 'Total' },
      { type: 'text', field: UWEBizExpDebtPeriodManagementDTO.DEBT_DESCRIPTION, label: 'Debt Description', sortable: true, width: 25 },
      { type: 'number', field: UWEBizExpDebtPeriodManagementDTO.DEBT_INS_AMT, label: 'Amount', sortable: true, decimal: 2, align: 'end', width: 15, summary: true },
      {
        type: 'status',
        field: UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS,
        label: 'Status',
        sortable: true,
        options: [
          { id: 'P', text: 'Pending' },
          { id: 'C', text: 'Completed' },
          { id: 'O', text: 'Overdue' },
        ],
        width: 15,
      },
    ],
    orderBy: { debt_start_date: 'asc' },
  };

  public onDatatableAction(event: DatatableActionEvent): void {
    switch (event.action) {
      case 'Edit':
        this.selectedRow = event.row;
        this.modal.open();
        break;

      case 'Delete':
        this.uweModalService.show({
          type: 'warning',
          title: 'Confirm Delete',
          message: `Are you sure you want to delete "${event.row[UWEBizExpDebtPeriodManagementDTO.DEBT_NAME]}"?`,
          onConfirm: () => this.onConfirmDelete(event),
          showCancelButton: true,
        });
        break;
    }
  }

  public onConfirmDelete(event: DatatableActionEvent): void {
    const puid = event.row['uwe_puid'];

    this.debtPeriodService.deleteByDebtPuid(puid).subscribe({
      next: () => {
        this.debtService.deleteDebt({ uwe_puid: puid } as any).subscribe({
          next: () => {
            this.uweModalService.show({
              type: 'success',
              title: 'Deleted',
              message: `"${event.row[UWEBizExpDebtPeriodManagementDTO.DEBT_NAME]}" has been deleted successfully.`,
              confirmButtonText: 'Ok, I got it.',
            });
            this.dataTable.refresh();
          },
          error: () => this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to delete debt.' })
        });
      },
      error: () => this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to delete debt periods.' })
    });
  }

  // ─── Search form ─────────────────────────────────────────

  public formGroupField(formGroup: FormGroup): void {
    this.searchFormGroup = formGroup;
  }

  public onSearch(): void {
    this.datatableConfig = {
      ...this.datatableConfig,
      search: {
        user_name: sessionStorage.getItem('user_name') || '',
        search_value: this.searchFormGroup.get('search_value')?.value,
        debt_status: this.searchFormGroup.get(UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS)?.value || 'A',
      }
    };
    this.dataTable?.refresh();
  }

  private onClear(): void {
    this.searchFormGroup.reset();
    this.searchFormGroup.get(UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS)?.setValue('A');
  }

  public onAddDataTable(): void {
    // TODO: เปิด modal สร้างใหม่ หรือ redirect
  }

  public onClearDataTable(): void {
    this.datatableConfig = {
      ...this.datatableConfig,
      search: { search_value: '', debt_status: 'A', user_name: sessionStorage.getItem('user_name') || '' }
    };
    this.onClear();
    this.dataTable?.refresh();
  }

  // ─── Modal ───────────────────────────────────────────────

	modalConfig: ModalConfig = {
		title: 'Edit Information',
		width: '600px',
		hideFooter: true,  // ซ่อน footer เดิม
		dynamicField: [
			{
				type: 'text',
				field: UWEBizExpDebtPeriodManagementDTO.DEBT_INS_AMT,
				label: 'Amount',
				placeholder: 'Enter amount',
			},
			{
				type: 'button',
				fieldColumn: 1,
				label: 'Cancel',
				variant: 'clear',
				icon: 'clear',
				width: 100,
				onClick: () => this.modal.close(),
			},
			{
				type: 'button',
				label: 'Save',
				variant: 'search',
				icon: 'search',
				width: 100,
				onClick: () => this.onModalConfirm(this.modalFormGroup), // ← เปลี่ยนจาก searchFormGroup
			},
		],
	};

	public onModalFormGroup(formGroup: FormGroup): void {
		this.modalFormGroup = formGroup;  // เก็บไว้ก่อน
		if (this.selectedRow) {
			formGroup.patchValue({
				[UWEBizExpDebtPeriodManagementDTO.DEBT_INS_AMT]: this.selectedRow[UWEBizExpDebtPeriodManagementDTO.DEBT_INS_AMT],
			});
		}
	}
  public onModalConfirm(formGroup: FormGroup | null): void {
    if (!formGroup?.valid) return;
    console.log('save', formGroup.value, 'row', this.selectedRow);
    // TODO: call API save แล้ว this.dataTable.refresh()
  }

	public onFormGroup(formGroup: FormGroup): void {
	}
}