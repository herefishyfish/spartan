import { Component, NO_ERRORS_SCHEMA, computed, inject, signal, viewChild } from '@angular/core';
import type { View } from '@nativescript/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import {
	DEFAULT_TOOLTIP_CONTENT_CLASSES,
	DEFAULT_TOOLTIP_SVG_CLASS,
	tooltipPositionVariants,
} from '@spartan-ng/helm/tooltip';
import { hlm } from '@spartan-ng/helm/utils';
import { type OverlayRef, Overlays } from '../ui/overlays';

type Side = 'top' | 'bottom';

/** Touch has no hover, so a tap or long press shows the tooltip and it hides itself after this long. */
const VISIBLE_MS = 1500;

@Component({
	selector: 'tooltip-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div class="flex flex-row flex-wrap gap-2">
			<button #top [class]="_outline" (click)="show($any(top), 'top')" (longPress)="show($any(top), 'top')">Top</button>
			<button
				#bottom
				[class]="_outline"
				(click)="show($any(bottom), 'bottom')"
				(longPress)="show($any(bottom), 'bottom')"
			>
				Bottom
			</button>
		</div>
		<p class="text-muted-foreground text-sm">Tap or long-press a button to show its tooltip.</p>

		<ng-template #panel>
			<div data-slot="tooltip-content" data-state="open" [attr.data-side]="_side()" [class]="_content">
				<span>Add to library</span>
				<div [class]="_arrow()"></div>
			</div>
		</ng-template>
	`,
})
export default class TooltipDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	private _open?: OverlayRef;
	private _timer?: ReturnType<typeof setTimeout>;
	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _content = hlm(DEFAULT_TOOLTIP_CONTENT_CLASSES, 'relative');
	protected readonly _side = signal<Side>('top');
	protected readonly _arrow = computed(() =>
		hlm(DEFAULT_TOOLTIP_SVG_CLASS, tooltipPositionVariants({ position: this._side() })),
	);

	protected show(anchor: View, side: Side) {
		this._open?.close();
		clearTimeout(this._timer);
		this._side.set(side);
		const ref = this._overlays.open(this._panel(), { kind: 'anchored', anchor, side, align: 'start' });
		this._open = ref;
		this._timer = setTimeout(() => ref.close(), VISIBLE_MS);
	}
}
