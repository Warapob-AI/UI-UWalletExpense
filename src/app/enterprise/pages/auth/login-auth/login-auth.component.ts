import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BackgroundAuthComponent } from '@components/background-auth/background-auth.component';
import { BackgroundCardComponent } from '@components/background-auth/background-card/background-card.component';
import { DynamicFieldComponent } from '@components/dynamic-field/dynamic-field.component';
import { DynamicField } from '@components/dynamic-field/dynamic-field.component.interface';
import { UWEBizAhUserIdDTO } from 'src/app/enterprise/biz-dto/UWEAuth/UWEBizAhUserIdDTO';
import { UWEModalService } from 'src/app/enterprise/biz-service/modal/UWEModalService';
import { UWEBizAhUserIdService } from 'src/app/enterprise/biz-service/UWEAuth/UWEBizAhUserIdService';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';

@Component({
  selector: 'app-login-auth',
  standalone: true,
  imports: [BackgroundAuthComponent, BackgroundCardComponent, DynamicFieldComponent],
  templateUrl: './login-auth.component.html',
  styleUrls: ['./login-auth.component.scss']
})
export class LoginAuthComponent implements OnInit {
  // DynamicField
	public initDynamicField!: DynamicField[];

	// FormGroup
	public formGroup!: FormGroup;

	constructor (
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
				type: "logo-and-text",
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
				fieldColumn: 12,
				label: 'Password',
				placeholder: 'Password',
				validator: { 
					required: true, 
					minLength: 6, 
					maxLength: 20 
				},
			},
			{
				type: 'button',
				fieldColumn: 12,
				width: 100,
				label: 'Login',
				variant: 'primary',
				positionX: 'center',
				onClick: () => this.onLogin(),
			},
			{
				type: 'button',
				fieldColumn: 12,
				width: 100,
				label: 'Sign up',
				variant: 'primary',
				positionX: 'center',
				onClick: () => this.onSignUp(),
			},
		];
  }

	private onLogin(): void {
		if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      Object.keys(this.formGroup.controls).forEach(key => {
        this.formGroup.get(key)?.markAsDirty();
      });
      return;
    }

		const username = this.formGroup.get(UWEBizAhUserIdDTO.USER_NAME)?.value;
    const password = this.formGroup.get(UWEBizAhUserIdDTO.USER_PASSWORD)?.value;
		
		const payload: UWEBizAhUserIdDTO = {
			user_name: username,
			user_password: password,
		} as UWEBizAhUserIdDTO

		this.uweBizAhUserIdService.loginUser(payload).subscribe({
			next: (res) => {

				console.log('Login response:', res); // Log the raw response for debugging
				if (!res) {
					this.uweModalService.show({
						type: 'error',
						title: 'Error',
						message: 'Not found user, please check your username and password',
					});
					return;
				}

				sessionStorage.setItem('access_token', res.access_token);
				sessionStorage.setItem('user_name', res.user_name);
				sessionStorage.setItem('user_firstname', res.user_firstname);
				sessionStorage.setItem('user_lastname', res.user_lastname);
				sessionStorage.setItem('user_role', res.user_role ?? '');
				sessionStorage.setItem('role_admin', res.role_admin);
				this.redirectToService.to('/users');
			},
			error: (err) => { 
				this.uweModalService.show({
					type: 'error',
					title: 'Error',
					message: 'Failed to login',
				});
			}
		})
	}

	private onSignUp(): void {
		this.redirectToService.to('/signup')
	}

	public formGroupField(formGroup: FormGroup) {
		this.formGroup = formGroup;
	}
}