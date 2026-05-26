import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackgroundComponent } from '@components/background/background.component';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';
import { UWEBizAhUserIdDTO } from 'src/app/enterprise/biz-dto/UWEAuth/UWEBizAhUserIdDTO';
import { UWEBizAhRoleIdDTO } from 'src/app/enterprise/biz-dto/UWEAuth/UWEBizAhRoleIdDTO';
import { environment } from 'src/app/environments/environment';
import { UWEBizAhUserIdService } from 'src/app/enterprise/biz-service/UWEAuth/UWEBizAhUserIdService';

@Component({
  selector: 'app-create-new-user',
  standalone: true,
  imports: [DynamicFieldComponent, BackgroundComponent],
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.scss']
})
export class CreateNewUserComponent implements OnInit {
  public initDynamicField!: DynamicField[];
  public formGroup!: FormGroup;
  public urlSelectRole: string = `${environment.PORT_API_ENTERPRISE_UWEAUTH}/ahroleid/select-role-list`;
  public isEditMode: boolean = false;
  public showPasswordFields: boolean = false;
  private editUserData: any = null;
  private hasSetInitialValues: boolean = false;

  constructor(
    private readonly redirectToService: RedirectToService,
    private readonly uweBizAhUserIdService: UWEBizAhUserIdService,
    private readonly uweModalService: UWEModalService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    const state = history.state;
    if (state && state.user) {
      this.isEditMode = true;
      this.editUserData = state.user;
    }
  }

  ngOnInit() {
    if (!this.isEditMode) {
      this.showPasswordFields = true;
    }
    this.dynamicField();
  }

  private dynamicField() {
    this.initDynamicField = [
      {
        type: 'text',
        field: UWEBizAhUserIdDTO.USER_NAME,
        fieldColumn: 3,
        label: 'Username',
        placeholder: 'Username',
        disabled: this.isEditMode,
        validator: { required: true, minLength: 4, maxLength: 20 },
      },
      {
        type: 'password',
        field: UWEBizAhUserIdDTO.USER_PASSWORD,
        fieldColumn: 3,
        label: this.isEditMode ? 'New Password' : 'Password',
        placeholder: this.isEditMode ? 'New Password' : 'Password',
        hide: !this.showPasswordFields,
        validator: (!this.isEditMode || this.showPasswordFields) ? { required: true, minLength: 6, maxLength: 20 } : undefined,
      },
      {
        type: 'password',
        field: UWEBizAhUserIdDTO.USER_CONFIRM_PASSWORD,
        fieldColumn: 3,
        label: 'Confirm Password',
        placeholder: 'Confirm Password',
        hide: !this.showPasswordFields,
        validator: (!this.isEditMode || this.showPasswordFields) ? { required: true, minLength: 6, maxLength: 20 } : undefined,
      },
      {
        type: 'text',
        field: UWEBizAhUserIdDTO.USER_EMAIL,
        fieldColumn: !this.isEditMode ? 3 : (this.showPasswordFields ? 3 : 9),
        label: 'Email',
        placeholder: 'Email',
        validator: { required: true, email: true },
      },
      {
        type: 'text',
        field: UWEBizAhUserIdDTO.USER_FIRSTNAME,
        fieldColumn: 3,
        label: 'Firstname',
        placeholder: 'Firstname',
        validator: { required: true, minLength: 2, maxLength: 20 },
      },
      {
        type: 'text',
        field: UWEBizAhUserIdDTO.USER_LASTNAME,
        fieldColumn: 3,
        label: 'Lastname',
        placeholder: 'Lastname',
        validator: { required: true, minLength: 2, maxLength: 20 },
      },
      {
        type: 'text',
        field: UWEBizAhUserIdDTO.USER_SALARY,
        fieldColumn: 3,
        label: 'Salary',
        placeholder: 'Salary',
        validator: { required: true, maxLength: 20 },
      },
      {
        type: 'dropdown',
        field: UWEBizAhRoleIdDTO.ROLE_ID,
        fieldColumn: 3,
        label: 'Role',
        url: this.urlSelectRole,
				search: {
					user_name: sessionStorage.getItem('user_name') || '',
					role_status: 'A',
				},
        valueField: UWEBizAhRoleIdDTO.ROLE_ID,
        labelField: UWEBizAhRoleIdDTO.ROLE_NAME_EN,
        orderBy: { role_name_en: 'asc' },
        validator: { required: true },
      },
      {
        type: 'radio',
        field: UWEBizAhUserIdDTO.USER_STATUS,
        fieldColumn: 3,
        label: 'Status',
        options: [
          { id: 'A', text: 'Active' },
          { id: 'I', text: 'Inactive' },
        ],
        validator: { required: true },
        disabled: !this.isEditMode,
        defaultValue: 'A',
      },
			{
				type: 'empty',
				fieldColumn: 7,
			},
      {
        type: 'button',
        fieldColumn: 1,
        positionX: 'end',
        label: 'Save',
        variant: 'save',
        icon: 'save',
        onClick: () => this.onSave(),
      },
      {
        type: 'button',
        fieldColumn: 1,
        positionX: 'end',
        label: 'Clear',
        variant: 'clear',
        icon: 'clear',
        onClick: () => this.onClear(),
      },
		...((!this.isEditMode || this.showPasswordFields) ? [
			{ 
				type: 'empty' as const,
				fieldColumn: 11 
			},
		] : [
			{
				type: 'button' as const,
				fieldColumn: 11,
				positionX: 'start' as const,
				label: 'Forgot Password',
				variant: 'primary' as const,
				width: 20,
				onClick: () => this.onForgotPassword(),
			},
		]),
		{
			type: 'button' as const,
			fieldColumn: 1,
			positionX: 'end' as const,
			label: 'Back',
			variant: 'clear' as const,
			icon: 'clear' as const,
			onClick: () => this.onBack(),
		},
    ];
  }

  private onForgotPassword(): void {
    this.showPasswordFields = true;
    this.dynamicField();

    const passCtrl = this.formGroup.get(UWEBizAhUserIdDTO.USER_PASSWORD);
    const confCtrl = this.formGroup.get(UWEBizAhUserIdDTO.USER_CONFIRM_PASSWORD);

    passCtrl?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
    confCtrl?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(20)]);

    passCtrl?.setValue('');
    confCtrl?.setValue('');

    passCtrl?.updateValueAndValidity();
    confCtrl?.updateValueAndValidity();

    this.cdr.detectChanges();
  }

  private onBack(): void {
    this.onUsersPage();
  }

  private onClear(): void {
    if (this.isEditMode) {
      this.showPasswordFields = false;

      const passCtrl = this.formGroup.get(UWEBizAhUserIdDTO.USER_PASSWORD);
      const confCtrl = this.formGroup.get(UWEBizAhUserIdDTO.USER_CONFIRM_PASSWORD);

      passCtrl?.clearValidators();
      confCtrl?.clearValidators();
      passCtrl?.setValue('');
      confCtrl?.setValue('');
      passCtrl?.updateValueAndValidity();
      confCtrl?.updateValueAndValidity();

      this.dynamicField();
      this.setFormValues(this.editUserData);
    } else {
      this.formGroup.reset();
      this.formGroup.get(UWEBizAhUserIdDTO.USER_STATUS)?.setValue('A');
    }
  }

	private setFormValues(user: any): void {
    this.formGroup.patchValue({
      [UWEBizAhUserIdDTO.USER_NAME]: user.user_name,
      [UWEBizAhUserIdDTO.USER_EMAIL]: user.user_email,
      [UWEBizAhUserIdDTO.USER_FIRSTNAME]: user.user_firstname,
      [UWEBizAhUserIdDTO.USER_LASTNAME]: user.user_lastname,
      [UWEBizAhUserIdDTO.USER_SALARY]: user.user_salary,
      [UWEBizAhRoleIdDTO.ROLE_ID]: user.user_role,
      [UWEBizAhUserIdDTO.USER_STATUS]: user.user_status,
    });
		 console.log('after patch role value:', this.formGroup.get(UWEBizAhRoleIdDTO.ROLE_ID)?.value);
		 console.log('user data:', this.editUserData);
  }

  private onSave(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      Object.keys(this.formGroup.controls).forEach(key => {
        this.formGroup.get(key)?.markAsDirty();
      });
      return;
    }

    const username = this.formGroup.get(UWEBizAhUserIdDTO.USER_NAME)?.value;
    const password = this.formGroup.get(UWEBizAhUserIdDTO.USER_PASSWORD)?.value;
    const confirmPassword = this.formGroup.get(UWEBizAhUserIdDTO.USER_CONFIRM_PASSWORD)?.value;
    const email = this.formGroup.get(UWEBizAhUserIdDTO.USER_EMAIL)?.value;
    const firstname = this.formGroup.get(UWEBizAhUserIdDTO.USER_FIRSTNAME)?.value;
    const lastname = this.formGroup.get(UWEBizAhUserIdDTO.USER_LASTNAME)?.value;
    const salary = this.formGroup.get(UWEBizAhUserIdDTO.USER_SALARY)?.value;
    const status = this.formGroup.get(UWEBizAhUserIdDTO.USER_STATUS)?.value;
    const roleId = this.formGroup.get(UWEBizAhRoleIdDTO.ROLE_ID)?.value;

    if (this.showPasswordFields && password !== confirmPassword) {
      this.uweModalService.show({
        type: 'error',
        title: 'Error',
        message: 'Passwords do not match',
      });
      return;
    }

    const payload: any = {
      user_name: username,
      user_email: email,
      user_firstname: firstname,
      user_lastname: lastname,
      user_salary: salary,
      user_status: status,
      user_role: roleId,
    };

    if (this.isEditMode) {
      payload.uwe_puid = this.editUserData.uwe_puid;
      payload.user_modify_by = sessionStorage.getItem('user_name') ?? 'SYSTEM';
      payload.user_modify_dt = new Date().toISOString();
      if (this.showPasswordFields) {
        payload.user_password = password;
      }

      this.uweBizAhUserIdService.updateUser(payload).subscribe({
        next: () => {
          this.uweModalService.show({
            type: 'success',
            title: 'Success',
            message: 'User updated successfully',
            onConfirm: () => this.onUsersPage(),
          });
        },
        error: () => {
          this.uweModalService.show({
            type: 'error',
            title: 'Error',
            message: 'Failed to update user',
          });
        }
      });
    } else {
      payload.user_password = password;
      payload.user_create_by = sessionStorage.getItem('user_name') ?? 'SYSTEM';
      payload.user_create_dt = new Date().toISOString();
      payload.user_modify_by = sessionStorage.getItem('user_name') ?? 'SYSTEM';
      payload.user_modify_dt = new Date().toISOString();

      this.uweBizAhUserIdService.checkDuplicatedUser(payload).subscribe({
        next: (res) => {
          if (res > 0) {
            this.uweModalService.show({
              type: 'error',
              title: 'Error',
              message: 'Duplicated Username. Please use another username.',
            });
            return;
          }

          this.uweBizAhUserIdService.createNewUser(payload).subscribe({
            next: () => {
              this.uweModalService.show({
                type: 'success',
                title: 'Success',
                message: 'User created successfully',
                onConfirm: () => this.onUsersPage(),
              });
            },
            error: () => {
              this.uweModalService.show({
                type: 'error',
                title: 'Error',
                message: 'Failed to create user',
              });
            },
          });
        }
      });
    }
  }

  private onUsersPage(): void {
    this.redirectToService.to('/users');
  }

  public formGroupField(formGroup: FormGroup) {
    this.formGroup = formGroup;
    if (this.isEditMode && this.editUserData && !this.hasSetInitialValues) {
      const passCtrl = this.formGroup.get(UWEBizAhUserIdDTO.USER_PASSWORD);
      const confCtrl = this.formGroup.get(UWEBizAhUserIdDTO.USER_CONFIRM_PASSWORD);
      passCtrl?.clearValidators();
      confCtrl?.clearValidators();
      passCtrl?.updateValueAndValidity();
      confCtrl?.updateValueAndValidity();

      this.setFormValues(this.editUserData);
      this.hasSetInitialValues = true;
    }
  }
}