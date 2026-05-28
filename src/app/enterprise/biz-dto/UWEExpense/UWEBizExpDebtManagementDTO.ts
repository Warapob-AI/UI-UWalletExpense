import { UWE } from "../UWEBizDTO";

export class UWEBizExpDebtManagementDTO extends UWE {
  public static readonly DEBT_CREATE_BY      = 'debt_create_by';
  public static readonly DEBT_CREATE_DT      = 'debt_create_dt';
  public static readonly DEBT_MODIFY_BY      = 'debt_modify_by';
  public static readonly DEBT_MODIFY_DT      = 'debt_modify_dt';
  public static readonly DEBT_NAME           = 'debt_name';
  public static readonly DEBT_TYPE           = 'debt_type';
  public static readonly DEBT_DESCRIPTION    = 'debt_description';
  public static readonly DEBT_PRINCIPAL      = 'debt_principal';
  public static readonly DEBT_INTEREST_YEAR  = 'debt_interest_year';
  public static readonly DEBT_FEE            = 'debt_fee';
  public static readonly DEBT_START_DATE     = 'debt_start_date';
  public static readonly DEBT_END_DATE       = 'debt_end_date';
  public static readonly DEBT_INS_TOTAL      = 'debt_ins_total';
  public static readonly DEBT_INS_AMT        = 'debt_ins_amt';
  public static readonly DEBT_DUE_DATE       = 'debt_due_date';
  public static readonly DEBT_STATUS         = 'debt_status';
	public static readonly DEBT_INS_PAID       = 'debt_ins_paid';
	public static readonly DEBT_INS_TOTAL_ALL  = 'debt_ins_total_all';
	public static readonly DEBT_USER_NAME      = 'debt_user_name';

  public debt_create_by?:     string;
  public debt_create_dt?:     string;
  public debt_modify_by?:     string;
  public debt_modify_dt?:     string;
  public debt_name?:          string;
  public debt_type?:          string;
  public debt_description?:   string;
  public debt_principal?:     string;
  public debt_interest_year?: string;
  public debt_fee?:           string;
  public debt_start_date?:    string;
  public debt_end_date?:      string;
  public debt_ins_total?:     string;
  public debt_ins_amt?:       string;
  public debt_due_date?:      string;
  public debt_status?:        string;
  public debt_ins_paid?:      string;
  public debt_ins_total_all?: string;
  public debt_user_name?:     string;
}