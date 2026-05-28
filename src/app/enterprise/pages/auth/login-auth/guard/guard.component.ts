import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private readonly router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('access_token');

    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    const decoded: any = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;
    const isExpired = expirationTime < Date.now();

    if (isExpired) {
      sessionStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    const remainingTime = expirationTime - Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000;

    if (remainingTime <= fiveMinutesInMs) {
      alert('Token is about to expire in less than 5 minutes. Please log in again.');
      sessionStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}