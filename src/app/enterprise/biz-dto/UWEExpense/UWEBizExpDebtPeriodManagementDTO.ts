import { UWE } from "../UWEBizDTO";

export class UWEBizExpDebtPeriodManagementDTO extends UWE {
  public static readonly DEBT_CREATE_BY       = 'debt_create_by';
  public static readonly DEBT_CREATE_DT       = 'debt_create_dt';
  public static readonly DEBT_MODIFY_BY       = 'debt_modify_by';
  public static readonly DEBT_MODIFY_DT       = 'debt_modify_dt';
  public static readonly DEBT_NAME            = 'debt_name';
	public static readonly DEBT_PERIOD				  = 'debt_period';
  public static readonly DEBT_TYPE            = 'debt_type';
  public static readonly DEBT_DESCRIPTION     = 'debt_description';
  public static readonly DEBT_INS_AMT         = 'debt_ins_amt';
  public static readonly DEBT_DUE_DATE        = 'debt_due_date';
  public static readonly DEBT_STATUS          = 'debt_status';
	public static readonly DEBT_USER_NAME       = 'debt_user_name';
	public static readonly DEBT_PUID_MANAGEMENT = 'debt_puid_management';

  public debt_create_by?:       string;
  public debt_create_dt?:       string;
  public debt_modify_by?:       string;
  public debt_modify_dt?:       string;
  public debt_name?:            string;
	public debt_period?:          string;
  public debt_type?:            string;
  public debt_description?:     string;
  public debt_ins_amt?:         string;
  public debt_due_date?:        string;
  public debt_status?:          string;
  public debt_user_name?:       string;
  public debt_puid_management?: string;
}