import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { GestureStateTypes, type PanGestureEventData, type View } from '@nativescript/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

type Split = 'outer' | 'inner';

const MIN = 10;
const STEP = 10;

@Component({
	selector: 'resizable-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div
			data-slot="resizable-group"
			data-panel-group-direction="horizontal"
			class="group flex h-[200px] w-full flex-row rounded-lg border"
		>
			<div data-slot="resizable-panel" class="min-w-0 basis-0 overflow-hidden" [style.flexGrow]="_sizes().outer">
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">One</span>
				</div>
			</div>
			<div
				role="separator"
				data-slot="resizable-handle"
				data-panel-group-direction="horizontal"
				[class]="_handle"
				(pan)="onPan('outer', $any($event))"
			>
				<div class="spartan-resizable-handle-icon z-10 flex shrink-0"></div>
			</div>
			<div data-slot="resizable-panel" class="min-w-0 basis-0 overflow-hidden" [style.flexGrow]="100 - _sizes().outer">
				<div
					data-slot="resizable-group"
					data-panel-group-direction="vertical"
					class="group flex h-full w-full flex-col data-[panel-group-direction=vertical]:flex-col"
				>
					<div data-slot="resizable-panel" class="min-h-0 basis-0 overflow-hidden" [style.flexGrow]="_sizes().inner">
						<div class="flex h-full items-center justify-center p-6">
							<span class="font-semibold">Two</span>
						</div>
					</div>
					<div
						role="separator"
						data-slot="resizable-handle"
						data-panel-group-direction="vertical"
						[class]="_handle"
						(pan)="onPan('inner', $any($event))"
					>
						<div class="spartan-resizable-handle-icon z-10 flex shrink-0 rotate-90"></div>
					</div>
					<div
						data-slot="resizable-panel"
						class="min-h-0 basis-0 overflow-hidden"
						[style.flexGrow]="100 - _sizes().inner"
					>
						<div class="flex h-full items-center justify-center p-6">
							<span class="font-semibold">Three</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		@for (control of _controls; track control.split) {
			<div class="flex flex-row items-center gap-2">
				<button [class]="_stepButton" (click)="resize(control.split, _sizes()[control.split] - _step)">
					<ui-icon name="lucideMinus" />
				</button>
				<button [class]="_stepButton" (click)="resize(control.split, _sizes()[control.split] + _step)">
					<ui-icon name="lucidePlus" />
				</button>
				<span class="text-muted-foreground text-sm">{{ control.label }} {{ _sizes()[control.split] }}%</span>
			</div>
		}
	`,
})
export default class ResizableDemo {
	protected readonly _controls: { split: Split; label: string }[] = [
		{ split: 'outer', label: 'One' },
		{ split: 'inner', label: 'Two' },
	];
	protected readonly _step = STEP;
	protected readonly _sizes = signal<Record<Split, number>>({ outer: 50, inner: 25 });
	protected readonly _stepButton = buttonVariants({ variant: 'outline', size: 'icon-sm' });
	protected readonly _handle =
		'bg-border ring-offset-background relative flex w-px items-center justify-center data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full';
	private _panStart = 0;

	protected resize(split: Split, size: number) {
		this._sizes.update((sizes) => ({ ...sizes, [split]: Math.round(Math.min(100 - MIN, Math.max(MIN, size))) }));
	}

	protected onPan(split: Split, event: PanGestureEventData) {
		if (event.state === GestureStateTypes.began) this._panStart = this._sizes()[split];
		const group = (event.object as View).parent as View;
		const { width, height } = group.getActualSize();
		const delta = split === 'outer' ? event.deltaX / width : event.deltaY / height;
		this.resize(split, this._panStart + delta * 100);
	}
}
