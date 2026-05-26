import { Routes } from '@angular/router';
import { AuthGuard } from './enterprise/pages/auth/login-auth/guard/guard.component';
import { LoginAuthComponent } from './enterprise/pages/auth/login-auth/login-auth.component';
import { SignupAuthComponent } from './enterprise/pages/auth/sign-up-auth/sign-up-auth.component';
import { UsersComponent } from './enterprise/pages/auth/users/users.component';
import { CreateNewUserComponent } from './enterprise/pages/auth/users/create-new-user/create-new-user.component';
import { RoleComponent } from './enterprise/pages/auth/role/role.component';
import { CreateNewRoleComponent } from './enterprise/pages/auth/role/create-new-role/create-new-role.component';

export const routes: Routes = [
	{ path: '', component: LoginAuthComponent },
	{ path: 'signup', component: SignupAuthComponent },
	{ path: 'users', component: UsersComponent },
	{ path: 'role', component: RoleComponent },
	{ path: 'users/create-new-user', component: CreateNewUserComponent },
	{ path: 'role/create-new-role', component: CreateNewRoleComponent },

	{
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'role', component: RoleComponent },
      { path: 'users/create-new-user', component: CreateNewUserComponent },
      { path: 'role/create-new-role', component: CreateNewRoleComponent },
    ]
  },

];
