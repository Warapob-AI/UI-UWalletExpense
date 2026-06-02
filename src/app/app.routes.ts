import { Routes } from '@angular/router';
import { AuthGuard } from './enterprise/pages/auth/login-auth/guard/guard.component';
import { LoginAuthComponent } from './enterprise/pages/auth/login-auth/login-auth.component';
import { SignupAuthComponent } from './enterprise/pages/auth/sign-up-auth/sign-up-auth.component';
import { UsersComponent } from './enterprise/pages/auth/users/users.component';
import { CreateNewUserComponent } from './enterprise/pages/auth/users/create-new-user/create-new-user.component';
import { RoleComponent } from './enterprise/pages/auth/role/role.component';
import { CreateNewRoleComponent } from './enterprise/pages/auth/role/create-new-role/create-new-role.component';
import { DebtManagementComponent } from './enterprise/pages/expense/debt-management/debt-management.component';
import { CreateDebtManagementComponent } from './enterprise/pages/expense/debt-management/create-debt-management/create-debt-management.component';
import { DebtPeriodManagementComponent } from './enterprise/pages/expense/debt-period-management/debt-period-management.component';
import { ApproveDebtManagementComponent } from './enterprise/pages/approval/approve-debt-management/approve-debt-management.component';
import { StockInvestmentComponent } from './enterprise/pages/stock-investment/stock-investment/stock-investment.component';
import { CreateStockInvestmentComponent } from './enterprise/pages/stock-investment/stock-investment/create-stock-investment/create-stock-investment.component';

export const routes: Routes = [
  { path: '', component: LoginAuthComponent },
  { path: 'signup', component: SignupAuthComponent },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'role', component: RoleComponent },
      { path: 'users/create-new-user', component: CreateNewUserComponent },
      { path: 'role/create-new-role', component: CreateNewRoleComponent },
      { path: 'expense/debt-management', component: DebtManagementComponent },
      { path: 'expense/debt-management/create-debt-management', component: CreateDebtManagementComponent },
      { path: 'expense/debt-period-management', component: DebtPeriodManagementComponent },
      { path: 'stock/stock-investment', component: StockInvestmentComponent },
      { path: 'stock/stock-investment/create-stock-investment', component: CreateStockInvestmentComponent },
      { path: 'approval/approve-debt-management', component: ApproveDebtManagementComponent },
    ]
  },
];