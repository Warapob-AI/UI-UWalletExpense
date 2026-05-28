import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BackgroundComponent } from '@components/background/background.component';
import { DatatableComponent } from '@components/datatable/datatable.component';
import { DatatableActionEvent, DatatableConfig } from '@components/datatable/datatable.component.interface';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { UWEBizAppDebtManagementDTO } from 'src/app/enterprise/biz-dto/UWEApproval/UWEBizAppDebtManagementDTO';
import { UWEBizAppDebtManagementService } from 'src/app/enterprise/biz-service/UWEApproval/UWEBizAppDebtManagementService';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-approve-debt-management',
  standalone: true,
  imports: [CommonModule, DynamicFieldComponent, BackgroundComponent, DatatableComponent],
  templateUrl: './approve-debt-management.component.html',
  styleUrls: ['./approve-debt-management.component.scss']
})
export class ApproveDebtManagementComponent implements OnInit {
  @ViewChild('dataTable') dataTable!: DatatableComponent;

  public initDynamicField!: DynamicField[];
  public formGroup!: FormGroup;

  public urlSelectPending: string = `${environment.PORT_API_ENTERPRISE_UWEAPPROVAL}/appdebt/select-pending`;

  constructor(
    private readonly uweModalService: UWEModalService,
    private readonly appDebtService: UWEBizAppDebtManagementService,
  ) {}

  ngOnInit(): void {
    this.dynamicField();
  }

  private dynamicField(): void {
    this.initDynamicField = [
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
    url: this.urlSelectPending,
    title: 'Approve Debt Management',
    search: {
      app_user_name: sessionStorage.getItem('user_name') ?? '',
      app_status: 'P',
    },
    action: [
      { type: 'Approve' as any },
    ],
    columns: [
      { type: 'action', width: 80 },
      {
        type: 'text',
        field: UWEBizAppDebtManagementDTO.APP_DEBT_NAME,
        label: 'Debt Name',
        sortable: true,
        width: 18,
      },
      {
        type: 'number',
        field: UWEBizAppDebtManagementDTO.APP_INSTALLMENT_NO,
        label: 'งวดที่',
        sortable: true,
        decimal: 0,
        align: 'end',
        width: 8,
      },
      {
        type: 'number',
        field: UWEBizAppDebtManagementDTO.APP_INSTALLMENT_AMT,
        label: 'Amount',
        sortable: true,
        decimal: 2,
        align: 'end',
        width: 12,
      },
      {
        type: 'text',
        field: UWEBizAppDebtManagementDTO.APP_DUE_DATE,
        label: 'Due Date',
        sortable: true,
        width: 12,
      },
      {
        type: 'status',
        field: UWEBizAppDebtManagementDTO.APP_STATUS,
        label: 'Status',
        sortable: true,
        options: [
          { id: 'P', text: 'Pending' },
          { id: 'A', text: 'Approved' },
        ],
        width: 10,
      },
    ],
    orderBy: { app_installment_no: 'asc' },
  };

  public onDatatableAction(event: DatatableActionEvent): void {
    if (event.action === 'Edit') {

    }
  }

  // public onApproveConfirmed(result: ApproveModalResult): void {
  //   const payload = {
  //     uwe_puid:        result.uwe_puid,
  //     app_slip_image:  result.slip_image,
  //     app_description: result.description,
  //     app_status:      'A',
  //     app_modify_by:   sessionStorage.getItem('user_name') ?? 'SYSTEM',
  //     app_modify_dt:   new Date().toISOString(),
  //   };

  //   this.appDebtService.approveInstallment(payload).subscribe({
  //     next: () => {
  //       this.uweModalService.show({
  //         type: 'success',
  //         title: 'Approved',
  //         message: 'Payment confirmed successfully.',
  //         confirmButtonText: 'Ok',
  //       });
  //       this.dataTable.refresh();
  //     },
  //     error: () => {
  //       this.uweModalService.show({ type: 'error', title: 'Error', message: 'Failed to approve. Please try again.' });
  //     }
  //   });
  // }

  // public onApproveCancel(): void {
  //   this.modalData = null;
  // }

  public onSearch(): void {
    this.datatableConfig = {
      ...this.datatableConfig,
      search: {
        app_user_name: sessionStorage.getItem('user_name') ?? '',
        app_status: 'P',
      }
    };
    this.dataTable?.refresh();
  }

  private onClear(): void {
    this.formGroup?.reset();
  }

  public onClearDataTable(): void {
    this.onSearch();
  }

  public formGroupField(formGroup: FormGroup): void {
    this.formGroup = formGroup;
  }
}