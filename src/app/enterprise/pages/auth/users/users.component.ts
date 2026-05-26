import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BackgroundComponent } from '@components/background/background.component';
import { DatatableComponent } from '@components/datatable/datatable.component';
import { DatatableActionEvent, DatatableConfig } from '@components/datatable/datatable.component.interface';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { UWEBizAhUserIdService } from 'src/app/enterprise/biz-service/UWEAuth/UWEBizAhUserIdService';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';
import { UWEBizAhUserIdDTO } from 'src/app/enterprise/biz-dto/UWEAuth/UWEBizAhUserIdDTO';
import { UWEBizAhRoleIdDTO } from 'src/app/enterprise/biz-dto/UWEAuth/UWEBizAhRoleIdDTO';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ DynamicFieldComponent, BackgroundComponent, DatatableComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
	// ViewChild
	@ViewChild('dataTable') dataTable!: DatatableComponent;
	
	// DynamicField
	public initDynamicField!: DynamicField[];
	
	// FormGroup
	public formGroup!: FormGroup;

	// Urls
	public urlSelectUser: string = `${environment.PORT_API_ENTERPRISE_UWEAUTH}/ahuserid/select-user`;
	
	constructor(
		private readonly redirectToService: RedirectToService,
		private readonly uweBizAhUserIdService: UWEBizAhUserIdService,
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
				placeholder: 'Username/Firstname/Lastname', 
			},
			{
				type: 'radio',
				field: UWEBizAhUserIdDTO.USER_STATUS,
				fieldColumn: 2,
				label: 'Search Value',
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
		]
	}

	datatableConfig: DatatableConfig = {
		url: this.urlSelectUser,
		title: 'Users',
		search: {
			user_status: this.formGroup?.get(UWEBizAhUserIdDTO.USER_STATUS)?.value || 'A',
		},
		disabledRow: (row: any) => {
			const isAdmin = sessionStorage.getItem('role_admin') === 'true';
			const isSelf = sessionStorage.getItem('user_name') === row[UWEBizAhUserIdDTO.USER_NAME];
			const disabled = !isAdmin && !isSelf;
			return { edit: disabled, delete: disabled };
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
			{
				type: 'text',
				field: UWEBizAhUserIdDTO.USER_NAME,
				label: 'Username',
				sortable: true,
				dateFormat: 'BE',
				width: 12,
			},
			{
				type: 'text',
				field: [UWEBizAhUserIdDTO.USER_FIRSTNAME, UWEBizAhUserIdDTO.USER_LASTNAME],
				label: 'Full name',
				sortable: true,
				separator: ' ',
				width: 20,
				summaryText: 'Total',
			},
			{
				type: 'number',
				field: UWEBizAhUserIdDTO.USER_SALARY,
				label: 'Salary',
				sortable: true,
				decimal: 2,
				align: 'end',
				width: 9,
				summary: true,
			},
			{
				type: 'text',
				field: UWEBizAhRoleIdDTO.ROLE_NAME_EN,
				label: 'Role',
				sortable: true,
				width: 12,
			},
			{
				type: 'status',
				field: UWEBizAhUserIdDTO.USER_STATUS,
				label: 'Status',
				sortable: true,
				options: [
					{ id: 'A', text: 'Active' },
					{ id: 'I', text: 'Inactive' },
				],
				width: 9,
			},
			{
				type: 'date',
				field: UWEBizAhUserIdDTO.USER_CREATE_DT,
				label: 'Create Date',
				sortable: true,
				dateFormat: 'BE',
				width: 12,
			},
			{
				type: 'text',
				field: UWEBizAhUserIdDTO.USER_CREATE_BY,
				label: 'Create By',
				sortable: true,
				width: 12,
			},
			{
				type: 'date',
				field: UWEBizAhUserIdDTO.USER_MODIFY_DT,
				label: 'Modify Date',
				sortable: true,
				dateFormat: 'BE',
				width: 12,
			},
			{
				type: 'text',
				field: UWEBizAhUserIdDTO.USER_MODIFY_BY,
				label: 'Modify By',
				sortable: true,
				width: 12,
			},
		],
		scrollLimitsRow: 10,
		orderBy: { user_salary: 'asc' },
	};

	public onDatatableAction(event: DatatableActionEvent): void {
    switch (event.action) {
      case 'Edit':   
        this.redirectToService.to('/users/create-new-user', { state: { user: event.row } });
        break;

			case 'Delete': 
				this.uweModalService.show({
					type: 'warning',
					title: 'Confirm Delete',
					message: `Are you sure you want to delete user "${event.row[UWEBizAhUserIdDTO.USER_NAME]}"?`,
					onConfirm: () => this.onConfirmDelete(event),
					showCancelButton: true,
				});
			break;
		}
	}

	public onConfirmDelete(event: DatatableActionEvent): void {
		this.uweBizAhUserIdService.deleteUser({ user_name: event.row[UWEBizAhUserIdDTO.USER_NAME] } as UWEBizAhUserIdDTO).subscribe({
			next: () => {
				this.uweModalService.show({
					type: 'success',
					title: 'Deleted',
					message: `User "${event.row[UWEBizAhUserIdDTO.USER_NAME]}" has been deleted successfully.`,
					confirmButtonText: 'Ok, I got it.',
				});
				this.dataTable.refresh();
			},
			error: () => {
				this.uweModalService.show({
					type: 'error',
					title: 'Error',
					message: `Failed to delete user "${event.row[UWEBizAhUserIdDTO.USER_NAME]}". Please try again.`,
					confirmButtonText: 'Ok, I got it.',
				});
			}
		});
	}
	
	public onSearch() {
		const value = this.formGroup.get('search_value')?.value;
		
		this.datatableConfig = {
      ...this.datatableConfig,
      search: {
        search_value: value,
				user_status: this.formGroup.get(UWEBizAhUserIdDTO.USER_STATUS)?.value || 'A',
      }
    };

		if (this.dataTable) {
			this.dataTable.refresh();
		}
	}

	private onClear(): void {
		this.formGroup.reset();
		this.formGroup.get(UWEBizAhUserIdDTO.USER_STATUS)?.setValue('A');
	}

	public onAddDataTable(): void {
		this.redirectToService.to('/users/create-new-user');
	}

	public onClearDataTable(): void {
		console.log('onClearDataTable called');
		this.datatableConfig = {
			...this.datatableConfig,
			search: {
				search_value: '',
				user_status: 'A',
			}
		};

		this.onClear();
		if (this.dataTable) {
			this.dataTable.refresh();
		}
	}

	public formGroupField(formGroup: FormGroup) {
		console.log('role_admin raw:', sessionStorage.getItem('role_admin'));
console.log('user_name raw:', sessionStorage.getItem('user_name'));
		this.formGroup = formGroup;
	}
}