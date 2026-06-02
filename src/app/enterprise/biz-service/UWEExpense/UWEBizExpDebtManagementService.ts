import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UWEBizExpDebtManagementDTO } from '../../biz-dto/UWEExpense/UWEBizExpDebtManagementDTO';
import { UWEEnv } from '../../../connection/UWEEnv';

@Injectable({
  providedIn: 'root'
})
export class UWEBizExpDebtManagementService {
  private readonly PORT_API_UWEEXP_DEBT: string = UWEEnv.PORT_API_UWEEXPENSE + '/exp-debt-management';

  constructor(
    private http: HttpClient
  ) {}

  public createDebt(body: UWEBizExpDebtManagementDTO): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEEXP_DEBT}/create-debt`, body);
  }

  public updateDebt(body: UWEBizExpDebtManagementDTO): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEEXP_DEBT}/update-debt`, body);
  }

  public deleteDebt(body: UWEBizExpDebtManagementDTO): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEEXP_DEBT}/delete-debt`, body);
  }

  public selectDebt(body: any): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEEXP_DEBT}/select-debt`, body);
  }

  public selectForTableDebtManagement(body: any): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEEXP_DEBT}/select-for-table-debt-management`, body);
  }
}