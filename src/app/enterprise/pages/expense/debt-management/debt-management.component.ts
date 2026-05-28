import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BackgroundComponent } from '@components/background/background.component';
import { DatatableComponent } from '@components/datatable/datatable.component';
import { DatatableActionEvent, DatatableConfig } from '@components/datatable/datatable.component.interface';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';
import { UWEBizExpDebtManagementDTO } from 'src/app/enterprise/biz-dto/UWEExpense/UWEBizExpDebtManagementDTO';
import { UWEBizExpDebtManagementService } from 'src/app/enterprise/biz-service/UWEExpense/UWEBizExpDebtManagementService';
import { environment } from 'src/app/environments/environment';
import { UWEBizExpDebtPeriodManagementService } from 'src/app/enterprise/biz-service/UWEExpense/UWEBizExpDebtPeriodManagementService';

@Component({
  selector: 'app-debt-management',
  standalone: true,
  imports: [DynamicFieldComponent, BackgroundComponent, DatatableComponent],
  templateUrl: './debt-management.component.html',
  styleUrls: ['./debt-management.component.scss']
})
export class DebtManagementComponent implements OnInit {
  // ViewChild
  @ViewChild('dataTable') dataTable!: DatatableComponent;

  // DynamicField
  public initDynamicField!: DynamicField[];

  // FormGroup
  public formGroup!: FormGroup;

  // Urls
  public urlSelectDebt: string = `${environment.PORT_API_ENTERPRISE_UWEEXPENSE}/exp-debt-management/select-debt`;

  constructor(
    private readonly redirectToService: RedirectToService,
    private readonly uweModalService: UWEModalService,
    private readonly debtService: UWEBizExpDebtManagementService,
		private readonly debtPeriodService: UWEBizExpDebtPeriodManagementService,
  ) {}

  ngOnInit() {
    this.dynamicField();
  }

  private dynamicField(): void {
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
        field: UWEBizExpDebtManagementDTO.DEBT_STATUS,
        fieldColumn: 2,
        label: 'Status',
        options: [
          { id: 'A', text: 'Active' },
          { id: 'I', text: 'Inactive' },
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

  datatableConfig: DatatableConfig = {
    url: this.urlSelectDebt,
    title: 'Debt Management',
    search: {
      debt_status: 'A',
			user_name: sessionStorage.getItem('user_name') || '',
    },
    action: [
      { type: 'Edit' },
      { type: 'Delete' },
    ],
    columns: [
      { type: 'action', width: 80 },
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_NAME,
        label: 'Debt Name',
        sortable: true,
        width: 9,
      },
			{
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_DESCRIPTION,
        label: 'Debt Description',
        sortable: true,
        width: 13,
      },
      {
        type: 'text',
        field: UWEBizExpDebtManagementDTO.DEBT_TYPE,
        label: 'Type',
        sortable: true,
        width: 7,
				summaryTextRight: 'Total',
      },
      {
        type: 'number',
        field: UWEBizExpDebtManagementDTO.DEBT_PRINCIPAL,
        label: 'Principal',
        sortable: true,
        decimal: 2,
        align: 'end',
        width: 8,
      },
      {
        type: 'number',
        field: UWEBizExpDebtManagementDTO.DEBT_INTEREST_YEAR,
        label: 'Interest (%/yr)',
        sortable: true,
        decimal: 2,
        align: 'end',
        width: 10,
      },
      {
        type: 'number',
        field: UWEBizExpDebtManagementDTO.DEBT_FEE,
        label: 'Fee',
        sortable: true,
        decimal: 2,
        align: 'end',
        width: 7,
      },
      {
        type: 'number',
        field: UWEBizExpDebtManagementDTO.DEBT_INS_AMT,
        label: 'Amount',
        sortable: true,
        decimal: 2,
        align: 'end',
        width: 8,
        summary: true,
      },
      {
        type: 'number',
        field: UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL,
        label: 'Period',
        sortable: true,
        decimal: 0,
        align: 'end',
        width: 7,
      },
			{
        type: 'number',
        field: UWEBizExpDebtManagementDTO.DEBT_INS_TOTAL_ALL,
        label: 'Amount All',
        sortable: true,
        decimal: 2,
        align: 'end',
        width: 8,
				summary: true,
      },
      {
        type: 'date',
        field: UWEBizExpDebtManagementDTO.DEBT_START_DATE,
        label: 'Start Date',
        sortable: true,
        dateFormat: 'AD',
        width: 8,
				summaryTextLeft: 'Baht',
      },
      {
        type: 'date',
        field: UWEBizExpDebtManagementDTO.DEBT_END_DATE,
        label: 'End Date',
        sortable: true,
        dateFormat: 'AD',
        width: 8,
      },
      {
        type: 'status',
        field: UWEBizExpDebtManagementDTO.DEBT_STATUS,
        label: 'Status',
        sortable: true,
        options: [
          { id: 'A', text: 'Active' },
          { id: 'I', text: 'Inactive' },
        ],
        width: 7,
      },
    ],
    orderBy: { debt_start_date: 'asc' },
  };

  public onDatatableAction(event: DatatableActionEvent): void {
    switch (event.action) {
      case 'Edit':
        this.redirectToService.to('/expense/debt-management/create-debt-management', { state: { debt: event.row } });
        break;

			case 'Delete':
				this.uweModalService.show({
					type: 'warning',
					title: 'Confirm Delete',
					message: `Are you sure you want to delete "${event.row[UWEBizExpDebtManagementDTO.DEBT_NAME]}"?`,
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
							message: `"${event.row[UWEBizExpDebtManagementDTO.DEBT_NAME]}" has been deleted successfully.`,
							confirmButtonText: 'Ok, I got it.',
						});
						this.dataTable.refresh();
					},
					error: () => {
						this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to delete debt.' });
					}
				});
			},
			error: () => {
				this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to delete debt periods.' });
			}
		});
	}

  public onSearch(): void {
    const value = this.formGroup.get('search_value')?.value;
    this.datatableConfig = {
      ...this.datatableConfig,
      search: {
				user_name: sessionStorage.getItem('user_name') || '',
        search_value: value,
        debt_status: this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_STATUS)?.value || 'A',
      }
    };
    if (this.dataTable) {
      this.dataTable.refresh();
    }
  }

  private onClear(): void {
    this.formGroup.reset();
    this.formGroup.get(UWEBizExpDebtManagementDTO.DEBT_STATUS)?.setValue('A');
  }

  public onAddDataTable(): void {
    this.redirectToService.to('/expense/debt-management/create-debt-management');
  }

  public onClearDataTable(): void {
    this.datatableConfig = {
      ...this.datatableConfig,
      search: { search_value: '', debt_status: 'A', user_name: sessionStorage.getItem('user_name') || '' }
    };
    this.onClear();
    if (this.dataTable) {
      this.dataTable.refresh();
    }
  }

  public formGroupField(formGroup: FormGroup): void {
    this.formGroup = formGroup;
  }
}