import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UWEBizAhRoleIdService } from '../../biz-service/UWEAuth/UWEBizAhRoleIdService';
import { UWEBizAhRoleIdDTO } from '../../biz-dto/UWEAuth/UWEBizAhRoleIdDTO';
import { NavGroup, LogoAndTextConfig } from './sidebar.component.interface';
import { UnsubscriberBase } from '@components/api/unsubscribe/unsubscribe';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent extends UnsubscriberBase implements OnInit {

  role = signal<UWEBizAhRoleIdDTO | undefined>(undefined);
  isLoading = signal(true);

  logoConfig: LogoAndTextConfig = {
    type: 'logo-and-text',
    src: '/assets/images/auth/logo.png',
    label: 'UWalletExpense',
    width: 40,
    fontWeight: 500,
  };

  readonly allNavGroups: NavGroup[] = [
    {
      id: 'setting',
      label: 'Setting',
      permission: 'role_can_see_setting',
      children: [
        { label: 'Users',        route: '/users',        icon: 'M12 12c2.7 0 4-1.3 4-4s-1.3-4-4-4-4 1.3-4 4 1.3 4 4 4zm0 2c-4.4 0-8 2.7-8 6h16c0-3.3-3.6-6-8-6z' },
        { label: 'Role',         route: '/role',         icon: 'M12 12c2.7 0 4-1.3 4-4s-1.3-4-4-4-4 1.3-4 4 1.3 4 4 4zm0 2c-4.4 0-8 2.7-8 6h16c0-3.3-3.6-6-8-6zm5-3l1.5 1.5L22 9l-1-1-3.5 3.5z' },
        { label: 'Line Connect', route: '/line-connect', icon: 'M12 12c2.7 0 4-1.3 4-4s-1.3-4-4-4-4 1.3-4 4 1.3 4 4 4zm0 2c-4.4 0-8 2.7-8 6h16c0-3.3-3.6-6-8-6z' },
      ],
    },
    {
      id: 'expense',
      label: 'Expense',
      permission: 'role_can_see_expense',
      children: [
        { label: 'Debt Management', route: '/expense/debt-management',        icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
				{ label: 'Debt Period Management', route: '/expense/debt-period-management',        icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
      ],
    },
		{
      id: 'stock',
      label: 'Stock Investment',
      permission: 'role_can_see_expense',
      children: [
        { label: 'Stock Investment', route: '/stock/stock-investment',        icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
      ],
    },
    // {
    //   id: 'report',
    //   label: 'Report Message',
    //   permission: 'role_can_see_report',
    //   children: [
    //     { label: 'Summary', route: '/report/summary', icon: 'M3 3h18v18H3zM7 17l3-4 3 3 3-5 3 3' },
    //   ],
    // },
    // {
    //   id: 'history',
    //   label: 'History',
    //   permission: 'role_can_see_history',
    //   children: [
    //     { label: 'Transactions', route: '/history', icon: 'M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 5v5l3 3' },
    //   ],
    // },
    {
      id: 'approval',
      label: 'Approval',
      permission: 'role_can_see_history',
      children: [
        { label: 'Approval Debt Management',   route: '/approval/approve-debt-management', icon: 'M20 6L9 17l-5-5' },
      ],
    },
  ];

  openGroups: Record<string, boolean> = {};

  visibleGroups = computed(() => {
    const roleId = sessionStorage.getItem('user_role');
    const currentRole = this.role();

    if (!roleId || !currentRole) {
      return this.allNavGroups.filter(g => g.id === 'setting');
    }

    return this.allNavGroups.filter(g =>
      this.canSee(g.permission as keyof UWEBizAhRoleIdDTO)
    );
  });

  constructor(private uweAhRoleIdService: UWEBizAhRoleIdService) {
    super();
  }

  ngOnInit(): void {
    const roleId = sessionStorage.getItem('user_role');

    if (!roleId) {
      this.openGroups['setting'] = true;
      this.isLoading.set(false);
      return;
    }

    this.loadRole(roleId);
  }

  private loadRole(roleId: string): void {
    const payload = new UWEBizAhRoleIdDTO();
    payload.role_id = roleId;

    this.subs.sink = this.uweAhRoleIdService.getRoleById(payload).subscribe({
      next: (res: any) => {
        this.role.set(res ?? undefined);

        const first = this.visibleGroups()[0];
        if (first) this.openGroups[first.id] = true;
        this.isLoading.set(false);
      },
      error: () => {
        this.openGroups['setting'] = true;
        this.isLoading.set(false);
      },
    });
  }

  canSee(permission: keyof UWEBizAhRoleIdDTO): boolean {
    const value = this.role()?.[permission];
    return value === true || value === 'true';
  }

  toggleGroup(id: string): void {
    this.openGroups[id] = !this.openGroups[id];
  }

  get logoWidth(): string {
    return `${this.logoConfig.width}px`;
  }
}