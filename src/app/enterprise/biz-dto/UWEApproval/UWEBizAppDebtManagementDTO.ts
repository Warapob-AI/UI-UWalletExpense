import { UWE } from "../UWEBizDTO";

export class UWEBizAppDebtManagementDTO extends UWE {
  public static readonly APP_CREATE_BY       = 'app_create_by';
  public static readonly APP_CREATE_DT       = 'app_create_dt';
  public static readonly APP_MODIFY_BY       = 'app_modify_by';
  public static readonly APP_MODIFY_DT       = 'app_modify_dt';
  public static readonly APP_DEBT_PUID       = 'app_debt_puid';
  public static readonly APP_DEBT_NAME       = 'app_debt_name';
  public static readonly APP_USER_NAME       = 'app_user_name';
  public static readonly APP_INSTALLMENT_NO  = 'app_installment_no';
  public static readonly APP_INSTALLMENT_AMT = 'app_installment_amt';
  public static readonly APP_DUE_DATE        = 'app_due_date';
  public static readonly APP_SLIP_IMAGE      = 'app_slip_image';
  public static readonly APP_DESCRIPTION     = 'app_description';
  public static readonly APP_STATUS          = 'app_status';

  public app_create_by?:       string;
  public app_create_dt?:       string;
  public app_modify_by?:       string;
  public app_modify_dt?:       string;
  public app_debt_puid?:       string;
  public app_debt_name?:       string;
  public app_user_name?:       string;
  public app_installment_no?:  number;
  public app_installment_amt?: string;
  public app_due_date?:        string;
  public app_slip_image?:      string;
  public app_description?:     string;
  public app_status?:          string;
}