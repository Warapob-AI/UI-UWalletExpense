import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BackgroundComponent } from '@components/background/background.component';
import { DatatableComponent } from '@components/datatable/datatable.component';
import { DatatableActionEvent, DatatableConfig } from '@components/datatable/datatable.component.interface';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { UWEBizAhRoleIdService } from 'src/app/enterprise/biz-service/UWEAuth/UWEBizAhRoleIdService';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';
import { UWEBizAhRoleIdDTO } from 'src/app/enterprise/biz-dto/UWEAuth/UWEBizAhRoleIdDTO';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [DynamicFieldComponent, BackgroundComponent, DatatableComponent],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  @ViewChild('dataTable') dataTable!: DatatableComponent;

  public initDynamicField!: DynamicField[];
  public formGroup!: FormGroup;
  public urlSelectRole: string = `${environment.PORT_API_ENTERPRISE_UWEAUTH}/ahroleid/select-role-list`;

  constructor(
    private readonly redirectToService: RedirectToService,
    private readonly uweBizAhRoleIdService: UWEBizAhRoleIdService,
    private readonly uweModalService: UWEModalService,
  ) {}

  ngOnInit() {
    this.dynamicField();
  }

  private dynamicField() {
    this.initDynamicField = [
      {
        type: 'text',
        field: 'search_value',
        fieldColumn: 3,
        label: 'Search Value',
        placeholder: 'Role Name EN/Role Name TH/Role Description',
      },
      {
        type: 'radio',
        field: UWEBizAhRoleIdDTO.ROLE_STATUS,
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
    url: this.urlSelectRole,
    title: 'Roles',
    search: {
			search_value: '',
			user_name: sessionStorage.getItem('user_name') || '',
      role_status: 'A',
    },
    action: [
			{ type: 'Edit' },
			{ type: 'Delete' },
		],
		columns: [
			{
				type: 'action',
				width: 100,
			},
      { type: 'text', field: UWEBizAhRoleIdDTO.ROLE_NAME_EN, label: 'Role Name EN', sortable: true, width: 20 },
      { type: 'text', field: UWEBizAhRoleIdDTO.ROLE_NAME_TH, label: 'Role Name TH', sortable: true, width: 20 },
      { type: 'text', field: UWEBizAhRoleIdDTO.ROLE_DESCRIPTION, label: 'Description', sortable: true, width: 20 },
      {
        type: 'status',
        field: UWEBizAhRoleIdDTO.ROLE_STATUS,
        label: 'Status',
        sortable: true,
        options: [
          { id: 'A', text: 'Active' },
          { id: 'I', text: 'Inactive' },
        ],
        width: 9,
      },
      { type: 'date', field: UWEBizAhRoleIdDTO.ROLE_CREATE_DT, label: 'Create Date', sortable: true, dateFormat: 'BE', width: 12 },
      { type: 'text', field: UWEBizAhRoleIdDTO.ROLE_CREATE_BY, label: 'Create By', sortable: true, width: 12 },
      { type: 'date', field: UWEBizAhRoleIdDTO.ROLE_MODIFY_DT, label: 'Modify Date', sortable: true, dateFormat: 'BE', width: 12 },
      { type: 'text', field: UWEBizAhRoleIdDTO.ROLE_MODIFY_BY, label: 'Modify By', sortable: true, width: 12 },
    ],
    scrollLimitsRow: 10,
    orderBy: { role_name_en: 'asc' },
  };

  public onDatatableAction(event: DatatableActionEvent): void {
    switch (event.action) {
      case 'Edit':
        this.redirectToService.to('/role/create-new-role', { state: { role: event.row } });
        break;

      case 'Delete':
        this.uweModalService.show({
          type: 'warning',
          title: 'Confirm Delete',
          message: `Are you sure you want to delete role "${event.row[UWEBizAhRoleIdDTO.ROLE_NAME_EN]}"?`,
          onConfirm: () => this.onConfirmDelete(event),
          showCancelButton: true,
        });
        break;
    }
  }

  public onConfirmDelete(event: DatatableActionEvent): void {

		console.log('event.row:', event.row);
		console.log('ROLE_ID key:', UWEBizAhRoleIdDTO.ROLE_ID);
		console.log('role_id value:', event.row[UWEBizAhRoleIdDTO.ROLE_ID]);

    this.uweBizAhRoleIdService.deleteRole({ role_id: event.row[UWEBizAhRoleIdDTO.ROLE_ID] } as UWEBizAhRoleIdDTO).subscribe({
      next: () => {
        this.uweModalService.show({
          type: 'success',
          title: 'Deleted',
          message: `Role "${event.row[UWEBizAhRoleIdDTO.ROLE_NAME_EN]}" has been deleted successfully.`,
          confirmButtonText: 'Ok, I got it.',
        });
        this.dataTable.refresh();
      },
      error: () => {
        this.uweModalService.show({
          type: 'error',
          title: 'Error',
          message: `Failed to delete role "${event.row[UWEBizAhRoleIdDTO.ROLE_NAME_EN]}". Please try again.`,
          confirmButtonText: 'Ok, I got it.',
        });
      }
    });
  }

  public onSearch() {
    this.datatableConfig = {
      ...this.datatableConfig,
      search: {
				user_name: sessionStorage.getItem('user_name') || '',
        search_value: this.formGroup.get('search_value')?.value,
        role_status: this.formGroup.get(UWEBizAhRoleIdDTO.ROLE_STATUS)?.value || 'A',
      }
    };
    if (this.dataTable) {
      this.dataTable.refresh();
    }
  }

  private onClear(): void {
    this.formGroup.reset();
    this.formGroup.get(UWEBizAhRoleIdDTO.ROLE_STATUS)?.setValue('A');
  }

  public onAddDataTable(): void {
    this.redirectToService.to('/role/create-new-role');
  }

  public onClearDataTable(): void {
    this.datatableConfig = {
      ...this.datatableConfig,
      search: {
				user_name: sessionStorage.getItem('user_name') || '',
        search_value: '',
        role_status: 'A',
      }
    };
    this.onClear();
    if (this.dataTable) {
      this.dataTable.refresh();
    }
  }

  public formGroupField(formGroup: FormGroup) {
    this.formGroup = formGroup;
  }
}