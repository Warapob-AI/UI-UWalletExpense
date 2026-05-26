import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BackgroundAuthComponent } from '@components/background-auth/background-auth.component';
import { BackgroundCardComponent } from '@components/background-auth/background-card/background-card.component';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEBizAhUserIdDTO } from 'src/app/enterprise/biz-dto/UWEAuth/UWEBizAhUserIdDTO';
import { UWEBizAhUserIdService } from 'src/app/enterprise/biz-service/UWEAuth/UWEBizAhUserIdService';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';

@Component({
  selector: 'app-sign-up-auth',
  standalone: true,
  imports: [BackgroundAuthComponent, BackgroundCardComponent, DynamicFieldComponent],
  templateUrl: './sign-up-auth.component.html',
  styleUrls: ['./sign-up-auth.component.scss']
})
export class SignupAuthComponent implements OnInit {
	// DynamicField
  public initDynamicField!: DynamicField[];
  
	// FormGroup
	public formGroup!: FormGroup;

  constructor(
    private readonly redirectToService: RedirectToService,
    private readonly uweBizAhUserIdService: UWEBizAhUserIdService,
		private readonly uweModalService: UWEModalService,
  ) {}

  ngOnInit() {
    this.dynamicField();
  }

  public dynamicField() {
    this.initDynamicField = [
      {
        type: 'logo-and-text',
        fieldColumn: 12,
        src: '/assets/images/auth/logo.png',
        label: 'UWalletExpense',
        width: 10,
        fontWeight: 500,
      },
      {
        type: 'text',
        field: UWEBizAhUserIdDTO.USER_NAME,
        fieldColumn: 12,
        label: 'Username',
        placeholder: 'Username',
        validator: { 
					required: true, 
					minLength: 4, 
					maxLength: 20 
				},
      },
      {
        type: 'password',
        field: UWEBizAhUserIdDTO.USER_PASSWORD,
        fieldColumn: 6,
        label: 'Password',
        placeholder: 'Password',
        validator: { 
					required: true, 
					minLength: 6, 
					maxLength: 20 
				},
      },
      {
        type: 'password',
        field: UWEBizAhUserIdDTO.USER_CONFIRM_PASSWORD,
        fieldColumn: 6,
        label: 'Confirm Password',
        placeholder: 'Confirm Password',
        validator: { 
					required: true, 
					minLength: 6, 
					maxLength: 20 
				},
      },
						{
        type: 'text',
        field: UWEBizAhUserIdDTO.USER_FIRSTNAME,
        fieldColumn: 6,
        label: 'Firstname',
        placeholder: 'Firstname',
        validator: { 
					required: true, 
					minLength: 2, 
					maxLength: 20 
				},
      },
			{
        type: 'text',
        field: UWEBizAhUserIdDTO.USER_LASTNAME,
        fieldColumn: 6,
        label: 'Lastname',
        placeholder: 'Lastname',
        validator: { 
					required: true, 
					minLength: 2, 
					maxLength: 20 
				},
      },
			{
        type: 'text',
        field: UWEBizAhUserIdDTO.USER_SALARY,
        fieldColumn: 6,
        label: 'Salary',
        placeholder: 'Salary',
        validator: { 
					required: true, 
					maxLength: 20 
				},
      },
			{
				type: 'radio',
				field: UWEBizAhUserIdDTO.USER_STATUS,
				fieldColumn: 6,
				label: 'Status',
				options: [
					{ id: 'A', text: 'Active' },
					{ id: 'I', text: 'Inactive' },
				],
				validator: { required: true },
				disabled: true,
				defaultValue: 'A',
			},
      {
        type: 'button',
        fieldColumn: 12,
        width: 100,
        label: 'Register',
        variant: 'primary',
        onClick: () => this.onRegister(),
      },
      {
        type: 'button',
        fieldColumn: 12,
        width: 100,
        label: 'Go to login page',
        variant: 'secondary',
        onClick: () => this.onLogin(),
      },
    ];
  }

  private onRegister(): void {
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
		const firstname = this.formGroup.get(UWEBizAhUserIdDTO.USER_FIRSTNAME)?.value;
		const lastname = this.formGroup.get(UWEBizAhUserIdDTO.USER_LASTNAME)?.value;
		const salary = this.formGroup.get(UWEBizAhUserIdDTO.USER_SALARY)?.value;
		const status = this.formGroup.get(UWEBizAhUserIdDTO.USER_STATUS)?.value;

    if (password !== confirmPassword) {
			this.uweModalService.show({
				type: 'error',
				title: 'Error',
				message: 'Passwords do not match',
			});
      return;
    }

    const payload: UWEBizAhUserIdDTO = {
      user_name: username,
      user_password: password,
			user_firstname: firstname,
			user_lastname: lastname,
			user_salary: salary,
			user_status: status,
    } as UWEBizAhUserIdDTO;

		this.uweBizAhUserIdService.checkDuplicatedUser(payload).subscribe({
			next: (res) => {
				if (res > 0) {
					console.log("เข้ามานี้!");
					this.uweModalService.show({
						type: 'error',
						title: 'Error',
						message: 'Duplicated Username. Please use another username.',
					});
					return;
				}

				this.uweBizAhUserIdService.createNewUser(payload).subscribe({
					next: (res) => {
						this.uweModalService.show({
							type: 'success',
							title: 'Success',
							message: 'User created successfully',
							onConfirm: () => this.onLogin(),
						});
					},
					error: (err) => {
						console.log('error called');
						this.uweModalService.show({
							type: 'error',
							title: 'Error',
							message: 'Failed to create user',
						});
					},
				});
			}
		})
  }

  private onLogin(): void {
    this.redirectToService.to('/');
  }

  public formGroupField(formGroup: FormGroup): void {
    this.formGroup = formGroup;
  }
}