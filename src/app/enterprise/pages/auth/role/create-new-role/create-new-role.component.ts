import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BackgroundComponent } from '@components/background/background.component';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';
import { UWEBizAhRoleIdDTO } from 'src/app/enterprise/biz-dto/UWEAuth/UWEBizAhRoleIdDTO';
import { UWEBizAhRoleIdService } from 'src/app/enterprise/biz-service/UWEAuth/UWEBizAhRoleIdService';
import { generateUUIDV } from '@components/generateuuidV/generateuuidV.component';

@Component({
	selector: 'app-create-new-role',
	standalone: true,
	imports: [DynamicFieldComponent, BackgroundComponent],
	templateUrl: './create-new-role.component.html',
	styleUrls: ['./create-new-role.component.scss']
})
export class CreateNewRoleComponent implements OnInit {
	public initDynamicField!: DynamicField[];
	public formGroup!: FormGroup;
	public isEditMode: boolean = false;
	private editRoleData: any = null;
	private hasSetInitialValues: boolean = false;

	constructor(
		private readonly redirectToService: RedirectToService,
		private readonly uweBizAhRoleIdService: UWEBizAhRoleIdService,
		private readonly uweModalService: UWEModalService,
		private readonly router: Router,
		private readonly cdr: ChangeDetectorRef
	) {
		const state = history.state;
		if (state && state.role) {
			this.isEditMode = true;
			this.editRoleData = state.role;
		}
	}

	ngOnInit() {
		this.dynamicField();
	}

	private dynamicField() {
		this.initDynamicField = [
			{ type: 'text', field: UWEBizAhRoleIdDTO.ROLE_NAME_EN, label: 'Role Name (EN)', placeholder: 'Role Name (EN)', validator: { required: true }, fieldColumn: 4 },
			{ type: 'text', field: UWEBizAhRoleIdDTO.ROLE_NAME_TH, label: 'Role Name (TH)', placeholder: 'Role Name (TH)', validator: { required: true }, fieldColumn: 4 },
			{ type: 'text', field: UWEBizAhRoleIdDTO.ROLE_DESCRIPTION, label: 'Description', placeholder: 'Description', fieldColumn: 4 },
			{ type: 'radio', field: UWEBizAhRoleIdDTO.ROLE_CAN_SEE_SETTING, label: 'Role Can See Setting', options: [{ id: 'T', text: 'True' }, { id: 'F', text: 'False' }], defaultValue: 'T', validator: { required: true }, fieldColumn: 2 },
			{ type: 'radio', field: UWEBizAhRoleIdDTO.ROLE_CAN_SEE_EXPENSE, label: 'Role Can See Expense', options: [{ id: 'T', text: 'True' }, { id: 'F', text: 'False' }], fieldColumn: 2 },
			{ type: 'radio', field: UWEBizAhRoleIdDTO.ROLE_CAN_SEE_REPORT, label: 'Role Can See Report', options: [{ id: 'T', text: 'True' }, { id: 'F', text: 'False' }], fieldColumn: 2 },
			{ type: 'radio', field: UWEBizAhRoleIdDTO.ROLE_CAN_SEE_HISTORY, label: 'Role Can See History', options: [{ id: 'T', text: 'True' }, { id: 'F', text: 'False' }], fieldColumn: 2 },
			{ type: 'radio', field: UWEBizAhRoleIdDTO.ROLE_ADMIN, label: 'Role Admin', options: [{ id: 'T', text: 'True' }, { id: 'F', text: 'False' }], fieldColumn: 4 },
			{ type: 'radio', field: UWEBizAhRoleIdDTO.ROLE_STATUS, label: 'Role Status', options: [{ id: 'A', text: 'Active' }, { id: 'I', text: 'Inactive' }], disabled: !this.isEditMode, defaultValue: 'A', validator: { required: true }, fieldColumn: 2 },
			{ type: 'empty', fieldColumn: 8 },
			{ type: 'button', label: 'Save', variant: 'save', icon: 'save', fieldColumn: 1, positionX: 'end', onClick: () => this.onSave() },
			{ type: 'button', label: 'Clear', variant: 'clear', icon: 'clear', fieldColumn: 1, positionX: 'end', onClick: () => this.onClear() },
			{ type: 'empty', fieldColumn: 11 },
			{ type: 'button', fieldColumn: 1, positionX: 'end', label: 'Back', variant: 'clear', icon: 'clear', onClick: () => this.onBack() },
		];
	}

	private onBack(): void {
		this.onRolesPage();
	}

	private onClear(): void {
		if (this.isEditMode) {
			this.dynamicField();
			this.setFormValues(this.editRoleData);
		} else {
			this.formGroup.reset();
			this.formGroup.get(UWEBizAhRoleIdDTO.ROLE_STATUS)?.setValue('A');
		}
	}

	private setFormValues(role: any): void {
		this.formGroup.patchValue({
			[UWEBizAhRoleIdDTO.ROLE_NAME_EN]: role.role_name_en,
			[UWEBizAhRoleIdDTO.ROLE_NAME_TH]: role.role_name_th,
			[UWEBizAhRoleIdDTO.ROLE_DESCRIPTION]: role.role_description,
			[UWEBizAhRoleIdDTO.ROLE_CAN_SEE_SETTING]: role.role_can_see_setting ? 'T' : 'F',
			[UWEBizAhRoleIdDTO.ROLE_CAN_SEE_EXPENSE]: role.role_can_see_expense ? 'T' : 'F',
			[UWEBizAhRoleIdDTO.ROLE_CAN_SEE_REPORT]: role.role_can_see_report ? 'T' : 'F',
			[UWEBizAhRoleIdDTO.ROLE_CAN_SEE_HISTORY]: role.role_can_see_history ? 'T' : 'F',
			[UWEBizAhRoleIdDTO.ROLE_ADMIN]: role.role_admin ? 'T' : 'F',
			[UWEBizAhRoleIdDTO.ROLE_STATUS]: role.role_status,
		});
	}

	private onSave(): void {
		if (this.formGroup.invalid) {
			this.formGroup.markAllAsTouched();
			Object.keys(this.formGroup.controls).forEach(key => {
				this.formGroup.get(key)?.markAsDirty();
			});
			return;
		}

		const payload: UWEBizAhRoleIdDTO = {
			...this.formGroup.value,
			role_can_see_setting: this.formGroup.value.role_can_see_setting === 'T',
			role_can_see_expense: this.formGroup.value.role_can_see_expense === 'T',
			role_can_see_report: this.formGroup.value.role_can_see_report === 'T',
			role_can_see_history: this.formGroup.value.role_can_see_history === 'T',
			role_admin: this.formGroup.value.role_admin === 'T',
		};

		if (this.isEditMode) {
			payload.role_id = this.editRoleData.role_id;
			payload.role_modify_by = sessionStorage.getItem('user_name') ?? 'SYSTEM';
			payload.role_modify_dt = new Date().toISOString();

			this.uweBizAhRoleIdService.checkDuplicatedRoleForUpdate(payload).subscribe({
				next: (res) => {
					if (res > 0) {
						this.uweModalService.show(
							{ type: 'error', 
								title: 'Error', 
								message: 'Role name (EN) or Role name (TH) already exists.' 
							});
						return;
					}
					this.uweBizAhRoleIdService.updateRole(payload).subscribe({
						next: () => {
							this.uweModalService.show(
								{
									type: 'success',
									title: 'Success', 
									message: 'Role updated successfully',
									confirmButtonText: 'Ok, I got it.',
									onConfirm: () => this.onRolesPage()
								});
						},
						error: () => {
							this.uweModalService.show(
								{ 
									type: 'error', 
									title: 'Error', 
									message: 'Failed to update role' 
								});
						}
					});
				}
			});
		} else {
			payload.role_id = generateUUIDV(8);
			payload.role_create_by = sessionStorage.getItem('user_name') ?? 'SYSTEM';
			payload.role_create_dt = new Date().toISOString();
			payload.role_modify_by = sessionStorage.getItem('user_name') ?? 'SYSTEM';
			payload.role_modify_dt = new Date().toISOString();
			payload.role_status = 'A';

			this.uweBizAhRoleIdService.checkDuplicatedRole(payload).subscribe({
				next: (res) => {
					if (res > 0) {
						this.uweModalService.show(
							{ type: 'error', 
								title: 'Error', 
								message: 'Role name (EN) or Role name (TH) already exists.' 
							});
						return;
					}
					this.uweBizAhRoleIdService.createRole(payload).subscribe({
						next: () => {
							this.uweModalService.show(
								{
									type: 'success',
									title: 'Success', 
									message: 'Role created successfully',
									confirmButtonText: 'Ok, I got it.',
									onConfirm: () => this.onRolesPage()
								});

						},
						error: () => {
							this.uweModalService.show(
								{ 
									type: 'error', 
									title: 'Error', 
									message: 'Failed to create role' 
								});
						}
					});
				}
			});
		}
	}

	private onRolesPage(): void {
		this.redirectToService.to('/role');
	}

	public formGroupField(formGroup: FormGroup) {
		this.formGroup = formGroup;
		if (this.isEditMode && this.editRoleData && !this.hasSetInitialValues) {
			this.setFormValues(this.editRoleData);
			this.hasSetInitialValues = true;
		}
	}
}