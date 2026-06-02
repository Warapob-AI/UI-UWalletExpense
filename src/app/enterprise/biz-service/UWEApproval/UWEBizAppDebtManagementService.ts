import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { UWEBizAppDebtManagementDTO } from '../../biz-dto/UWEApproval/UWEBizAppDebtManagementDTO';

@Injectable({ providedIn: 'root' })
export class UWEBizAppDebtManagementService {
  private readonly base = `${environment.PORT_API_ENTERPRISE_UWEAPPROVE}/approve-debt-period-management`;

  public constructor(private readonly http: HttpClient) {}

	public insertApprove(payload: UWEBizAppDebtManagementDTO): Observable<UWEBizAppDebtManagementDTO> {
		return this.http.post<UWEBizAppDebtManagementDTO[]>(`${this.base}/insert`, payload).pipe(
			map(res => res[0])
		);
	}
}