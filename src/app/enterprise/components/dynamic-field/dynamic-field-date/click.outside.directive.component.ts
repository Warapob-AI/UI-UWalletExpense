import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

	@HostListener('document:click', ['$event.target'])
	public onClick(target: EventTarget | null): void {
		if (!target) return;
		if (!this.el.nativeElement.contains(target as HTMLElement)) {
			this.clickOutside.emit();
		}
	}
}