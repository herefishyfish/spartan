import { Component, NO_ERRORS_SCHEMA, inject, viewChild } from '@angular/core';
import type { View } from '@nativescript/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';
import { Overlays } from '../ui/overlays';

@Component({
	selector: 'hover-card-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div class="flex flex-row">
			<button #trigger data-slot="hover-card-trigger" [class]="_link" (click)="open($any(trigger))">
				&#64;analogjs
			</button>
		</div>
		<p class="text-muted-foreground text-sm">Tap the handle to show the card.</p>

		<ng-template #panel>
			<div
				data-slot="hover-card-content"
				data-state="open"
				data-side="bottom"
				class="spartan-hover-card-content z-50 w-80 outline-none"
			>
				<div class="flex flex-row justify-between gap-4">
					<div data-slot="avatar" data-size="sm" [class]="_avatar">
						<img
							data-slot="avatar-image"
							class="spartan-avatar-image aspect-square size-full object-cover"
							[src]="_logo"
						/>
					</div>
					<div class="flex flex-1 flex-col gap-1">
						<h4 class="text-sm font-semibold">&#64;analogjs</h4>
						<p class="text-sm">The Angular meta-framework – build Angular applications faster.</p>
						<div class="flex flex-row items-center pt-2">
							<ui-icon name="lucideCalendar" class="mr-2 opacity-70" />
							<span class="text-muted-foreground text-xs">Joined December 2021</span>
						</div>
					</div>
				</div>
			</div>
		</ng-template>
	`,
})
export default class HoverCardDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	protected readonly _link = buttonVariants({ variant: 'link' });
	protected readonly _avatar = 'spartan-avatar group/avatar relative flex shrink-0 select-none';
	protected readonly _logo = 'https://github.com/analogjs.png';

	protected open(anchor: View) {
		this._overlays.open(this._panel(), { kind: 'anchored', anchor, side: 'bottom', align: 'start' });
	}
}
