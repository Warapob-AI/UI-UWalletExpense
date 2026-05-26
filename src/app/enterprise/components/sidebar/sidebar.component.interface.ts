export type SidebarRole = 'admin' | 'manager' | 'staff' | 'viewer';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
}

export interface NavGroup {
  id: string;
  label: string;
  permission: string;
  children: NavItem[];
}

export interface LogoAndTextConfig {
  type: 'logo-and-text';
  src: string;
  label: string;
  width: number;
  fontWeight: number;
}