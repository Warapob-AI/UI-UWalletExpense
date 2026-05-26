import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RedirectToService } from 'src/app/enterprise/biz-service/UWERedirectToService';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  fullName: string = '';
  isDropdownOpen: boolean = false;

  constructor(
		private redirectToService: RedirectToService
	) {}

  ngOnInit(): void {
    const firstName = sessionStorage.getItem('user_firstname') ?? '';
    const lastName = sessionStorage.getItem('user_lastname') ?? '';
    this.fullName = `${firstName} ${lastName}`.trim();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.navigation__user')) {
      this.isDropdownOpen = false;
    }
  }

  public onLogout(): void {
		console.log('logout called');
		sessionStorage.clear();
		this.redirectToService.to('/');
	}
}