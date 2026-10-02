import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { GestureStateTypes, type PanGestureEventData, type TapGestureEventData, type View } from '@nativescript/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

const THUMB = 16;

@Component({
	selector: 'slider-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div class="flex flex-row items-center justify-between">
			<span class="text-sm font-medium">Volume</span>
			<span class="text-muted-foreground text-sm">{{ _value() }}</span>
		</div>
		<div
			data-slot="slider"
			data-orientation="horizontal"
			role="slider"
			class="group flex w-full touch-none flex-col select-none"
			[attr.aria-valuenow]="_value()"
			aria-valuemin="0"
			aria-valuemax="100"
		>
			<div
				class="relative flex w-full flex-row items-center py-2"
				(tap)="onTap($any($event))"
				(pan)="onPan($any($event))"
			>
				<div
					data-orientation="horizontal"
					class="spartan-slider-track relative mx-2 flex grow flex-row overflow-hidden"
				>
					<div
						data-orientation="horizontal"
						class="spartan-slider-range basis-0 select-none data-horizontal:h-full"
						[style.flexGrow]="_value()"
					></div>
					<div class="basis-0" [style.flexGrow]="_max - _value()"></div>
				</div>
				<div class="absolute inset-0 flex flex-row items-center">
					<div class="basis-0" [style.flexGrow]="_value()"></div>
					<div data-orientation="horizontal" class="spartan-slider-thumb block shrink-0 select-none"></div>
					<div class="basis-0" [style.flexGrow]="_max - _value()"></div>
				</div>
			</div>
		</div>
		<div class="flex flex-row items-center gap-2">
			<button [class]="_stepButton" (click)="set(_value() - _step)"><ui-icon name="lucideMinus" /></button>
			<button [class]="_stepButton" (click)="set(_value() + _step)"><ui-icon name="lucidePlus" /></button>
			<span class="text-muted-foreground text-sm">Drag or tap the track, or step by {{ _step }}</span>
		</div>
	`,
})
export default class SliderDemo {
	protected readonly _max = 100;
	protected readonly _step = 5;
	protected readonly _value = signal(50);
	protected readonly _stepButton = buttonVariants({ variant: 'outline', size: 'icon-sm' });
	private _panStart = 0;

	protected set(value: number) {
		this._value.set(Math.round(Math.min(this._max, Math.max(0, value))));
	}

	protected onTap(event: TapGestureEventData) {
		this.set(((event.getX() - THUMB / 2) / this.travel(event.object as View)) * this._max);
	}

	protected onPan(event: PanGestureEventData) {
		if (event.state === GestureStateTypes.began) this._panStart = this._value();
		this.set(this._panStart + (event.deltaX / this.travel(event.object as View)) * this._max);
	}

	private travel(view: View) {
		return Math.max(1, view.getActualSize().width - THUMB);
	}
}
