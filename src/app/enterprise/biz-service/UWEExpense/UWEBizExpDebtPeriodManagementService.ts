import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UWEEnv } from '../../../connection/UWEEnv';
import { UWEBizExpDebtPeriodManagementDTO } from '../../biz-dto/UWEExpense/UWEBizExpDebtPeriodManagementDTO';

@Injectable({
  providedIn: 'root'
})
export class UWEBizExpDebtPeriodManagementService {
  private readonly PORT_API_UWEEXP_DEBT_PERIOD: string = UWEEnv.PORT_API_UWEEXPENSE + '/exp-debt-period-management';

  constructor(
    private http: HttpClient
  ) {}

  public createDebtPeriod(body: UWEBizExpDebtPeriodManagementDTO[]): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEEXP_DEBT_PERIOD}/create-debt-period`, body);
  }

  public updateDebtPeriod(body: UWEBizExpDebtPeriodManagementDTO): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEEXP_DEBT_PERIOD}/update-debt-period`, body);
  }

  public deleteDebtPeriod(body: UWEBizExpDebtPeriodManagementDTO): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEEXP_DEBT_PERIOD}/delete-debt-period`, body);
  }

	public deleteByDebtPuid(debtPuid: string): Observable<any> {
		return this.http.post(`${this.PORT_API_UWEEXP_DEBT_PERIOD}/delete-by-debt-puid`, { debt_puid_management: debtPuid });
	}

  public selectDebtPeriod(body: UWEBizExpDebtPeriodManagementDTO): Observable<any> {
    return this.http.post(`${this.PORT_API_UWEEXP_DEBT_PERIOD}/select-debt-period`, body);
  }
}