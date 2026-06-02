import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive()
export class UnsubscriberBase implements OnDestroy {
  private mySubscriptions: Subscription[] = [];

	protected subs = {
		set sink(subscription: Subscription | null | undefined) {
			if (subscription) {
				this.add(subscription);
			}
		},
		add: (sub: Subscription) => {
			this.mySubscriptions.push(sub);
		}
	};

  ngOnDestroy(): void {
    if (this.mySubscriptions.length > 0) {
      this.mySubscriptions.forEach(sub => {
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe();
        }
      });
      console.log(`${this.constructor.name} Clear Subscription Already!`);
    }
  }
}