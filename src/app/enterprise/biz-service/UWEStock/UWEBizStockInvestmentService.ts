import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { UWEBizStockInvestmentDTO } from '../../biz-dto/UWEStock/UWEBizStockInvestmentDTO';

@Injectable({ providedIn: 'root' })
export class UWEBizStockInvestmentService {
  private readonly baseUrl = `${environment.PORT_API_ENTERPRISE_UWESTOCK}/stock-investment`;

  constructor(private readonly http: HttpClient) {}

  public createStock(payload: UWEBizStockInvestmentDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-stock`, payload);
  }

  public updateStock(payload: UWEBizStockInvestmentDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-stock`, payload);
  }

  public deleteStock(payload: UWEBizStockInvestmentDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete-stock`, payload);
  }

  public selectStock(payload: Partial<UWEBizStockInvestmentDTO>): Observable<any> {
    return this.http.post(`${this.baseUrl}/select-stock`, payload);
  }
}