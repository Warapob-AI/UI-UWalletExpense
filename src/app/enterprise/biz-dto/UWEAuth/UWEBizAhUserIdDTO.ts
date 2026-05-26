import { UWE } from "../UWEBizDTO";

export class UWEBizAhUserIdDTO extends UWE {
	public static readonly USER_CREATE_BY = 'user_create_by';
  public static readonly USER_CREATE_DT = 'user_create_dt';
  public static readonly USER_MODIFY_BY = 'user_modify_by';
  public static readonly USER_MODIFY_DT = 'user_modify_dt';
  public static readonly USER_NAME = 'user_name';
  public static readonly USER_PASSWORD = 'user_password';
  public static readonly USER_FIRSTNAME = 'user_firstname';
  public static readonly USER_LASTNAME = 'user_lastname';
  public static readonly USER_EMAIL = 'user_email';
  public static readonly USER_SALARY = 'user_salary';
  public static readonly USER_ROLE = 'user_role';
  public static readonly USER_STATUS = 'user_status';

	// No Field Column Database
	public static readonly USER_CONFIRM_PASSWORD = "user_confirm_password"; 
	public static readonly ROLE_ADMIN = "role_admin";

	public user_create_by?: string;
  public user_create_dt?: string;
  public user_modify_by?: string;
  public user_modify_dt?: string;
  public user_name?: string;
  public user_password?: string;
  public user_firstname?: string;
  public user_lastname?: string;
  public user_email?: string;
  public user_salary?: string;
  public user_role?: string;
  public user_status?: string;

	// No Field Column Database
	public role_admin?: boolean;
}