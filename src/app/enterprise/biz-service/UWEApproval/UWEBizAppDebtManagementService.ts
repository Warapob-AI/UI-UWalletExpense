import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UWEEnv } from '../../../connection/UWEEnv';

@Injectable({
  providedIn: 'root'
})
export class UWEBizAppDebtManagementService {
  private readonly BASE: string = UWEEnv.PORT_API_UWEAPPROVAL + '/appdebt';

  constructor(private http: HttpClient) {}

  public bulkInsertInstallments(body: any[]): Observable<any> {
    return this.http.post(`${this.BASE}/bulk-insert`, body);
  }

  public selectPendingDebt(body: any): Observable<any> {
    return this.http.post(`${this.BASE}/select-pending`, body);
  }

  public approveInstallment(body: any): Observable<any> {
    return this.http.post(`${this.BASE}/approve`, body);
  }
}