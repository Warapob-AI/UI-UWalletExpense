import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background-card',
	standalone: true,
	imports: [CommonModule],
  templateUrl: './background-card.component.html',
  styleUrls: ['./background-card.component.scss']
})
export class BackgroundCardComponent {
	// Property
	private _width: string = '30vw';
  private _height: string = '70vh';
	private _borderRadius: string = '12px';
	private _borderWidth: string = '1px';

	// Getter Setter
  @Input() set width(value: string | number) {
    this._width = `${value}vw`;
  }
  get width(): string {
    return this._width;
  }

  @Input() set height(value: string | number) {
    this._height = `${value}vh`;
  }
  get height(): string {
    return this._height;
  }

	@Input() set borderRadius(value: string | number) {
		const num = typeof value === 'string' ? parseFloat(value) : value;
		this._borderRadius = isNaN(num) ? '12px' : `${num}px`;
	}
	get borderRadius(): string {
		return this._borderRadius;
	}

	@Input() set borderWidth(value: string | number) {
		const num = typeof value === 'string' ? parseFloat(value) : value;
		this._borderWidth = isNaN(num) ? '12px' : `${num}px`;
	}
	get borderWidth(): string {
		return this._borderWidth;
	}
}