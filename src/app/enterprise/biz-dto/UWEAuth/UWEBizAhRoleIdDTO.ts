import { UWE } from "../UWEBizDTO";

export class UWEBizAhRoleIdDTO extends UWE {
  public static readonly ROLE_CREATE_BY   = 'role_create_by';
  public static readonly ROLE_CREATE_DT   = 'role_create_dt';
  public static readonly ROLE_MODIFY_BY   = 'role_modify_by';
  public static readonly ROLE_MODIFY_DT   = 'role_modify_dt';
  public static readonly ROLE_ID          = 'role_id';
  public static readonly ROLE_NAME_EN     = 'role_name_en';
  public static readonly ROLE_NAME_TH     = 'role_name_th';
  public static readonly ROLE_DESCRIPTION = 'role_description';
  public static readonly ROLE_CAN_SEE_SETTING = 'role_can_see_setting';
  public static readonly ROLE_CAN_SEE_EXPENSE = 'role_can_see_expense';
  public static readonly ROLE_CAN_SEE_REPORT  = 'role_can_see_report';
  public static readonly ROLE_CAN_SEE_HISTORY = 'role_can_see_history';
  public static readonly ROLE_ADMIN           = 'role_admin';
	public static readonly ROLE_STATUS          = 'role_status';

  public role_create_by?: string;
  public role_create_dt?: string;
  public role_modify_by?: string;
  public role_modify_dt?: string;
  public role_id?: string;
  public role_name_en?: string;
  public role_name_th?: string;
  public role_description?: string;
  public role_can_see_setting?: boolean;
  public role_can_see_expense?: boolean;
  public role_can_see_report?: boolean;
  public role_can_see_history?: boolean;
  public role_admin?: boolean;
	public role_status?: string;
}