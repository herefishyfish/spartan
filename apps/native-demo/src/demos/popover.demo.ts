import { Component, ElementRef, NO_ERRORS_SCHEMA, inject, signal, viewChild } from '@angular/core';
import type { View } from '@nativescript/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Overlays } from '../ui/overlays';

@Component({
	selector: 'popover-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div class="flex flex-row">
			<button #trigger data-slot="popover-trigger" [class]="_outline" (click)="open()">Open popover</button>
		</div>
		<p class="text-muted-foreground text-sm">Width {{ _width() }}, height {{ _height() }}</p>

		<ng-template #panel>
			<div
				data-slot="popover-content"
				data-state="open"
				data-side="bottom"
				class="spartan-popover-content relative flex w-72 flex-col"
			>
				<div data-slot="popover-header" class="spartan-popover-header">
					<h4 data-slot="popover-title" class="spartan-popover-title">Dimensions</h4>
					<p data-slot="popover-description" class="spartan-popover-description">Set the dimensions for the layer.</p>
				</div>
				@for (field of _fields; track field.label) {
					<div class="grid grid-cols-3 items-center gap-4">
						<span class="text-sm font-medium">{{ field.label }}</span>
						<input
							class="spartan-input col-span-2 h-8"
							data-slot="input"
							[value]="field.value()"
							(input)="field.value.set($any($event).target.value)"
						/>
					</div>
				}
			</div>
		</ng-template>
	`,
})
export default class PopoverDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _trigger = viewChild.required('trigger', { read: ElementRef<View> });
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _width = signal('100%');
	protected readonly _height = signal('25px');
	protected readonly _fields = [
		{ label: 'Width', value: this._width },
		{ label: 'Height', value: this._height },
	];

	protected open() {
		this._overlays.open(this._panel(), {
			kind: 'anchored',
			anchor: this._trigger().nativeElement,
			side: 'bottom',
			align: 'start',
		});
	}
}
