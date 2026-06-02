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
import { UWEBizIOFileDTO } from 'src/app/enterprise/biz-dto/UWEIO/UWEBizIOFileDTO';
import { UWEBizIOFileService } from 'src/app/enterprise/biz-service/UWEIO/UWEBizIOFileService';
import { UWEBizAppDebtManagementService } from 'src/app/enterprise/biz-service/UWEApproval/UWEBizAppDebtManagementService';
import { UWEBizAppDebtManagementDTO } from 'src/app/enterprise/biz-dto/UWEApproval/UWEBizAppDebtManagementDTO';
import { UnsubscriberBase } from '@components/api/unsubscribe/unsubscribe';
import { catchError, concatMap, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-approve-debt-management',
  standalone: true,
  imports: [DynamicFieldComponent, BackgroundComponent, DatatableComponent, ModalComponent],
  templateUrl: './approve-debt-management.component.html',
  styleUrls: ['./approve-debt-management.component.scss']
})
export class ApproveDebtManagementComponent extends UnsubscriberBase implements OnInit {

  @ViewChild('dataTable') dataTable!: DatatableComponent;
  @ViewChild('modal') modal!: ModalComponent;

  public initDynamicField!: DynamicField[];
  public searchFormGroup!: FormGroup;
  public modalFormGroup!: FormGroup;
  public modalConfig!: ModalConfig;

  private selectedRow: any = null;
  private isViewMode: boolean = false;

  public urlSelectDebt: string = `${environment.PORT_API_ENTERPRISE_UWEEXPENSE}/exp-debt-period-management/select-debt-period`;

  constructor(
    private readonly uweModalService: UWEModalService,
    private readonly debtService: UWEBizExpDebtManagementService,
    private readonly debtPeriodService: UWEBizExpDebtPeriodManagementService,
    private readonly ioFileService: UWEBizIOFileService,
    private readonly approveService: UWEBizAppDebtManagementService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.initSearchField();
    this.modalConfig = this.buildModalConfig(false);
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
				type: 'date',
				field: UWEBizExpDebtPeriodManagementDTO.DEBT_DATE_FROM,
				fieldColumn: 2,
				label: 'Debt Date From',
			},
			{
				type: 'date',
				field: UWEBizExpDebtPeriodManagementDTO.DEBT_DATE_TO,
				fieldColumn: 2,
				label: 'Debt Date To',
			},
      {
        type: 'radio',
        field: UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS,
        fieldColumn: 3,
        label: 'Status',
        options: [
          { id: 'P', text: 'Pending' },
          { id: 'C', text: 'Completed' },
          { id: 'All', text: 'All' },
        ],
        defaultValue: 'P',
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

  private buildModalConfig(viewMode: boolean): ModalConfig {
    return {
      title: viewMode ? 'Approve Detail' : 'Approve Debt Item',
      width: '600px',
      hideFooter: true,
      dynamicField: [
        {
          type: 'text',
          field: UWEBizIOFileDTO.IO_DESCRIPTION,
          label: 'Description',
          placeholder: viewMode ? '' : 'Enter description',
          fieldColumn: 12,
          disabled: viewMode,
        },
        {
          type: 'upload',
          field: UWEBizIOFileDTO.IO_BASE_64,
          label: 'Attachment',
          fieldColumn: 12,
          acceptedExtensions: ['jpg', 'jpeg', 'png'],
          validator: { required: false },
          disabled: viewMode,
        },
        {
          type: 'empty',
          fieldColumn: viewMode ? 11 : 10,
        },
        ...(!viewMode ? [{
          type: 'button' as const,
          fieldColumn: 1,
          label: 'Approve',
          positionX: 'end' as const,
          variant: 'save' as const,
          icon: 'save' as const,
          onClick: () => this.onModalConfirm(this.modalFormGroup),
        }] : []),
        {
          type: 'button' as const,
          fieldColumn: 1,
          label: 'Close',
          positionX: 'end' as const,
          variant: 'clear' as const,
          icon: 'clear' as const,
          onClick: () => this.modal.close(),
        },
      ],
    };
  }

  public datatableConfig: DatatableConfig = {
    url: this.urlSelectDebt,
    title: 'Approve Debt Management',
    getAll: true,
    search: {
      user_name: sessionStorage.getItem('user_name') || '',
      debt_status: 'P',
    },
    action: [
      { type: 'Approve' },
      { type: 'View' },
    ],
    disabledRow: (row) => ({
      approve: row[UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS] === 'C',
      view:    row[UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS] !== 'C',
    }),
    columns: [
      { type: 'action', width: 100 },
      { type: 'text',   field: UWEBizExpDebtPeriodManagementDTO.DEBT_NAME,        label: 'Debt Name',        sortable: true, width: 20 },
      { type: 'text',   field: UWEBizExpDebtPeriodManagementDTO.DEBT_PERIOD,       label: 'Debt Period',       sortable: true, width: 9 },
      { type: 'date',   field: UWEBizExpDebtPeriodManagementDTO.DEBT_DUE_DATE,     label: 'Debt Due Date',     sortable: true, width: 9 },
      { type: 'text',   field: UWEBizExpDebtPeriodManagementDTO.DEBT_TYPE,         label: 'Type',              sortable: true, width: 7, summaryTextRight: 'Total' },
      { type: 'text',   field: UWEBizExpDebtPeriodManagementDTO.DEBT_DESCRIPTION,  label: 'Debt Description',  sortable: true, width: 25 },
      { type: 'number', field: UWEBizExpDebtPeriodManagementDTO.DEBT_INS_AMT,      label: 'Amount',            sortable: true, decimal: 2, align: 'end', width: 15, summary: true },
      {
        type: 'status',
        field: UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS,
        label: 'Status',
        sortable: true,
        options: [
          { id: 'P', text: 'Pending' },
          { id: 'C', text: 'Completed' },
        ],
        width: 15,
      },
    ],
    orderBy: { debt_period: 'asc' },
  };

  public onDatatableAction(event: DatatableActionEvent): void {
    switch (event.action) {
      case 'Approve':
        this.isViewMode = false;
        this.selectedRow = event.row;
        this.modalConfig = this.buildModalConfig(false);
        this.modal.open();
        break;

      case 'View':
        this.isViewMode = true;
        this.selectedRow = event.row;
        this.modalConfig = this.buildModalConfig(true);
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

		this.subs.sink = this.debtPeriodService.deleteByDebtPuid(puid).pipe(

			catchError((err) => {
				this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to delete period debt.' });
				return EMPTY;
			}),

			concatMap((resForPeriod) => this.debtService.deleteDebt({ uwe_puid: puid } as any).pipe(
				catchError((err) => {
					this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to delete debt.' });
					return EMPTY;
				}),
				map((resForDebt) => ({ resForPeriod, resForDebt }))
			))
		).subscribe({
			next: ({resForPeriod, resForDebt}) => {
				this.uweModalService.show({
					type: 'success',
					title: 'Deleted',
					message: `"${event.row[UWEBizExpDebtPeriodManagementDTO.DEBT_NAME]}" has been deleted successfully.`,
					confirmButtonText: 'Ok, I got it.',
				});
				this.dataTable.refresh();
			},
			error: (err) => {
				// Do Somethings
			},
			complete: () => {
				// Do Somethings
			}
		})
  }

  public formGroupField(formGroup: FormGroup): void {
    this.searchFormGroup = formGroup;
  }

  public onSearch(): void {
    this.datatableConfig = {
      ...this.datatableConfig,
      search: {
          user_name:     sessionStorage.getItem('user_name') || '',
          search_value:  this.searchFormGroup.get('search_value')?.value,
          debt_status:   this.searchFormGroup.get(UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS)?.value || 'P',
          debt_due_date: this.searchFormGroup.get(UWEBizExpDebtPeriodManagementDTO.DEBT_DUE_DATE)?.value || null,
      }
    };
    this.dataTable?.refresh();
  }

  private onClear(): void {
    this.searchFormGroup.reset();
    this.searchFormGroup.get(UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS)?.setValue('P');
  }

  public onAddDataTable(): void {}

  public onClearDataTable(): void {
    this.datatableConfig = {
      ...this.datatableConfig,
      search: { search_value: '', debt_status: 'P', user_name: sessionStorage.getItem('user_name') || '' }
    };
    this.searchFormGroup.reset();
    this.searchFormGroup.get(UWEBizExpDebtPeriodManagementDTO.DEBT_STATUS)?.setValue('P');
    this.onSearch();
  }

  public onModalFormGroup(formGroup: FormGroup): void {
    this.modalFormGroup = formGroup;

    if (!this.isViewMode || !this.selectedRow) return;

    const ioFilePuid = this.selectedRow[UWEBizExpDebtPeriodManagementDTO.DEBT_PUID_IO_FILE];
    if (!ioFilePuid) return;

    this.ioFileService.getIOFileByPuid(ioFilePuid).subscribe({
      next: (ioFile) => {
        setTimeout(() => {
          formGroup.patchValue({
            [UWEBizIOFileDTO.IO_DESCRIPTION]: ioFile.io_description,
            [UWEBizIOFileDTO.IO_BASE_64]:     ioFile.io_base_64,
          });
        });
      },
      error: () => this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to load attachment.' }),
    });
  }

  public onModalConfirm(formGroup: FormGroup | null): void {
    if (!formGroup?.valid) return;

    const description = formGroup.get(UWEBizIOFileDTO.IO_DESCRIPTION)?.value;
    const base64Raw   = formGroup.get(UWEBizIOFileDTO.IO_BASE_64)?.value;
    const userName    = sessionStorage.getItem('user_name') || '';

    const doApprove = (ioFilePuid: string | null) => {
      const approvePayload = {
        app_create_by: userName,
        app_create_dt: new Date().toISOString(),
        app_modify_by: userName,
        app_modify_dt: new Date().toISOString(),
      } as UWEBizAppDebtManagementDTO;

      this.approveService.insertApprove(approvePayload).subscribe({
        next: (approveRes) => {
          
          const rawDueDate = this.selectedRow[UWEBizExpDebtPeriodManagementDTO.DEBT_DUE_DATE];
          let formattedDueDate = rawDueDate;
          if (rawDueDate) {
            const dateObj = new Date(rawDueDate);
            if (!isNaN(dateObj.getTime())) {
              formattedDueDate = this.toLocalISODate(dateObj);
            }
          }

          const periodPayload = {
            ...this.selectedRow,
            debt_status: 'C',
            debt_due_date: formattedDueDate,
            debt_puid_approve: approveRes.uwe_puid,
            debt_puid_io_file: ioFilePuid,
            debt_modify_by: userName,
            debt_modify_dt: new Date().toISOString(),
          };

          this.debtPeriodService.updateDebtPeriod(periodPayload).subscribe({
            next: () => {
              const debtPuid = this.selectedRow[UWEBizExpDebtPeriodManagementDTO.DEBT_PUID_MANAGEMENT];
              
              this.debtService.selectDebt({ uwe_puid: debtPuid }).subscribe({
                next: (debtMainRes) => {
                  const targetData = debtMainRes?.data?.[0] || (Array.isArray(debtMainRes) ? debtMainRes[0] : debtMainRes);
                  const currentBalance = Number(targetData?.debt_balance) || 0;
                  const paidAmount = Number(this.selectedRow[UWEBizExpDebtPeriodManagementDTO.DEBT_INS_AMT]) || 0;
                  const newBalance = parseFloat((currentBalance - paidAmount).toFixed(2));

                  let formattedStartDate = targetData?.debt_start_date;
                  if (targetData?.debt_start_date) {
                    const sDate = new Date(targetData.debt_start_date);
                    if (!isNaN(sDate.getTime())) {
                      formattedStartDate = this.toLocalISODate(sDate).split('T')[0];
                    }
                  }

                  let formattedEndDate = targetData?.debt_end_date;
                  if (targetData?.debt_end_date) {
                    const eDate = new Date(targetData.debt_end_date);
                    if (!isNaN(eDate.getTime())) {
                      formattedEndDate = this.toLocalISODate(eDate).split('T')[0];
                    }
                  }

                  const debtPayload = {
                    ...targetData,
                    uwe_puid: debtPuid,
                    debt_balance: newBalance,
                    debt_start_date: formattedStartDate,
                    debt_end_date: formattedEndDate,
                    debt_modify_by: userName,
                    debt_modify_dt: new Date().toISOString(),
										debt_status: newBalance === 0 ? 'C' : targetData.debt_status,
                  };

                  this.debtService.updateDebt(debtPayload).subscribe({
                    next: () => {
                      this.uweModalService.show({
                        type: 'success',
                        title: 'Approved',
                        message: 'Debt period has been approved and balance updated successfully.',
                        confirmButtonText: 'Ok',
                      });
                      this.modal.close();
                      this.dataTable.refresh();
                    },
                    error: () => this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to update main debt balance.' })
                  });
                },
                error: () => this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to retrieve main debt data.' })
              });
            },
            error: () => this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to update debt period status.' }),
          });
        },
        error: () => this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to save approve record.' }),
      });
    };

    if (base64Raw) {
      const base64 = base64Raw.includes(',') ? base64Raw.split(',')[1] : base64Raw;

      const ioPayload = {
        io_description: description,
        io_base_64:     base64,
        io_create_by:   userName,
        io_create_dt:   new Date().toISOString(),
        io_modify_by:   userName,
        io_modify_dt:   new Date().toISOString(),
      } as UWEBizIOFileDTO;

      this.ioFileService.insertIOFile(ioPayload).subscribe({
        next: (res) => {
          console.log('IO file saved:', res);
          doApprove(res.uwe_puid || null);
        },
        error: () => this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to upload attachment.' }),
      });
    } else {
      doApprove(null);
    }
  }

  public onFormGroup(formGroup: FormGroup): void {}

  private loadViewModeData(): void {
    if (!this.modalFormGroup || !this.selectedRow) return;

    const ioFilePuid = this.selectedRow[UWEBizExpDebtPeriodManagementDTO.DEBT_PUID_IO_FILE];

    if (!ioFilePuid) return;

    this.ioFileService.getIOFileByPuid(ioFilePuid).subscribe({
      next: (ioFile) => {
        this.modalFormGroup.patchValue({
          [UWEBizIOFileDTO.IO_DESCRIPTION]: ioFile.io_description,
          [UWEBizIOFileDTO.IO_BASE_64]:     ioFile.io_base_64,
        });
      },
      error: () => this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to load attachment.' }),
    });
  }

  private toLocalISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}T00:00:00`;
  }
}