import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { UWEBizIOFileDTO } from '../../biz-dto/UWEIO/UWEBizIOFileDTO';

@Injectable({ providedIn: 'root' })
export class UWEBizIOFileService {
  private readonly base = `${environment.PORT_API_ENTERPRISE_UWEIO}/app-io-file`;

  public constructor(private readonly http: HttpClient) {}

	public insertIOFile(payload: UWEBizIOFileDTO): Observable<UWEBizIOFileDTO> {
		return this.http.post<UWEBizIOFileDTO[]>(`${this.base}/insert`, payload).pipe(
			map(res => res[0])
		);
	}

	public getIOFileByPuid(puid: string): Observable<UWEBizIOFileDTO> {
		return this.http.post<UWEBizIOFileDTO>(`${this.base}/select-by-puid`, { uwe_puid: puid });
	}

}