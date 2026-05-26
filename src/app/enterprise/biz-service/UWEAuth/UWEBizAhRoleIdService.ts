import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UWEBizAhRoleIdDTO } from '../../biz-dto/UWEAuth/UWEBizAhRoleIdDTO';
import { UWEEnv } from '../../../connection/UWEEnv';

@Injectable({
  providedIn: 'root'
})
export class UWEBizAhRoleIdService {
  private readonly PORT_API_UWEAUTH_AHROLEID: string = UWEEnv.PORT_API_UWEAUTH + '/ahroleid';

  constructor(private http: HttpClient) {}

  public getRoleList(): Observable<UWEBizAhRoleIdDTO[]> {
    return this.http.post<UWEBizAhRoleIdDTO[]>(`${this.PORT_API_UWEAUTH_AHROLEID}/role-list`, {});
  }

  public getRoleById(body: UWEBizAhRoleIdDTO): Observable<UWEBizAhRoleIdDTO> {
    return this.http.post<UWEBizAhRoleIdDTO>(`${this.PORT_API_UWEAUTH_AHROLEID}/role-by-id`, body);
  }

  public createRole(body: UWEBizAhRoleIdDTO): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEAUTH_AHROLEID}/create-role`, body);
  }

  public updateRole(body: UWEBizAhRoleIdDTO): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEAUTH_AHROLEID}/update-role`, body);
  }

  public deleteRole(body: UWEBizAhRoleIdDTO): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEAUTH_AHROLEID}/delete-role`, body);
  }

  public checkDuplicatedRole(body: UWEBizAhRoleIdDTO): Observable<number> {
    return this.http.post<number>(`${this.PORT_API_UWEAUTH_AHROLEID}/check-duplicated-role`, body);
  }

  public checkDuplicatedRoleForUpdate(body: UWEBizAhRoleIdDTO): Observable<number> {
    return this.http.post<number>(`${this.PORT_API_UWEAUTH_AHROLEID}/check-duplicated-role-for-update`, body);
  }
}