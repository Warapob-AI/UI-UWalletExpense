import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UWEBizAhUserIdDTO } from '../../biz-dto/UWEAuth/UWEBizAhUserIdDTO';
import { UWEEnv } from '../../../connection/UWEEnv';

@Injectable({
  providedIn: 'root'
})
export class UWEBizAhUserIdService {
  private readonly PORT_API_UWEAUTH_AHUSER_ID: string = UWEEnv.PORT_API_UWEAUTH + '/ahuserid';

  constructor (
		private http: HttpClient
	) {}

  public createNewUser(body: UWEBizAhUserIdDTO): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEAUTH_AHUSER_ID}/create-new-user`, body);
  }

	public checkDuplicatedUser(body: UWEBizAhUserIdDTO): Observable<any> {
		return this.http.post(`${this.PORT_API_UWEAUTH_AHUSER_ID}/check-duplicated-user`, body)
	}

	public loginUser(body: UWEBizAhUserIdDTO): Observable<any> {
		return this.http.post(`${this.PORT_API_UWEAUTH_AHUSER_ID}/login-user`, body)
	}

	public updateUser(body: UWEBizAhUserIdDTO): Observable<any> {
		return this.http.post(`${this.PORT_API_UWEAUTH_AHUSER_ID}/update-user`, body)
	}
	
	public deleteUser(body: UWEBizAhUserIdDTO): Observable<any> {
		return this.http.post(`${this.PORT_API_UWEAUTH_AHUSER_ID}/delete-user`, body)
	}

	public selectUser(body: UWEBizAhUserIdDTO): Observable<any> {
		return this.http.post(`${this.PORT_API_UWEAUTH_AHUSER_ID}/login-user`, body)
	}
}