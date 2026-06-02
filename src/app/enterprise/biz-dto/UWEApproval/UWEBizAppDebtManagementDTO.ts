import { UWE } from "../UWEBizDTO";

export class UWEBizAppDebtManagementDTO extends UWE {
  public static readonly APP_CREATE_BY       = 'app_create_by';
  public static readonly APP_CREATE_DT       = 'app_create_dt';
  public static readonly APP_MODIFY_BY       = 'app_modify_by';
  public static readonly APP_MODIFY_DT       = 'app_modify_dt';

  public app_create_by?:       string;
  public app_create_dt?:       string;
  public app_modify_by?:       string;
  public app_modify_dt?:       string;
}