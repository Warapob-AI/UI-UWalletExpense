import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './enterprise/components/sidebar/sidebar.component';
import { NavigationComponent } from './enterprise/components/navigation/navigation.component';
import { UnsubscriberBase } from '@components/api/unsubscribe/unsubscribe';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App extends UnsubscriberBase implements OnInit {
  currentPageName: string = '';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
		super();
	}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setPageName(this.router.url);

      this.subs.sink = this.router.events.pipe(
        filter(e => e instanceof NavigationEnd)
      ).subscribe((e: any) => {
        this.setPageName(e.url);
      });
    }
  }

	private setPageName(url: string): void {
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    const path = cleanUrl.split('?')[0];

    const nameMap: Record<string, string> = {
      'users': 'Users',
      'users/create-new-user': 'Create New User',
			'role/create-new-role': 'Create New Role',
      'role': 'Role',
      'line-connect': 'Line Connect',
      'expense': 'Expense',
      'report': 'Report Message',
      'history': 'History',
    };

    this.currentPageName = nameMap[path] ?? path;
  }

  get showSidebar(): boolean {
    const hiddenRoutes = ['/', '/login', '/signup'];
    return !hiddenRoutes.includes(this.router.url);
  }
}