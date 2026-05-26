import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectToService {
  constructor(private router: Router) {}

  public to(path: string, extras?: any): void {
    if (extras && (extras.state || extras.queryParams || extras.fragment)) {
      this.router.navigate([path], extras);
    } else {
      this.router.navigate([path], { queryParams: extras });
    }
  }
}