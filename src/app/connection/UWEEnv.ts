import { environment } from '../environments/environment';

export class UWEEnv {
  public static readonly PORT_API: string = environment.PORT_API;
	public static readonly PORT_API_ENTERPRISE: string = this.PORT_API + '/enterprise';
	public static readonly PORT_API_UWEAUTH: string = this.PORT_API_ENTERPRISE + '/uweauth';
}