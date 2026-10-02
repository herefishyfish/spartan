import { Component, NO_ERRORS_SCHEMA, inject, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Overlays } from '../ui/overlays';

@Component({
	selector: 'sonner-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Toast</h3>
			<div class="flex flex-row flex-wrap gap-2">
				<button [class]="_outline" (click)="showToast()">Show Toast</button>
				<button [class]="_outline" (click)="_overlays.toast('Event has been created')">Default</button>
				<button
					[class]="_outline"
					(click)="_overlays.toast('Event has been created', { description: 'Monday, January 3rd at 6:00pm' })"
				>
					Description
				</button>
			</div>
			<p class="text-muted-foreground text-sm">Undo tapped {{ _undos() }} times</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Types</h3>
			<div class="flex flex-row flex-wrap gap-2">
				<button [class]="_outline" (click)="_overlays.toast('Event has been created', { type: 'success' })">
					Success
				</button>
				<button [class]="_outline" (click)="_overlays.toast('Event will start in 10 minutes', { type: 'info' })">
					Info
				</button>
				<button [class]="_outline" (click)="_overlays.toast('Failed to create event', { type: 'error' })">Error</button>
				<button [class]="_outline" (click)="_overlays.toast('Event is missing a name', { type: 'warning' })">
					Warning
				</button>
			</div>
		</section>
	`,
})
export default class SonnerDemo {
	protected readonly _overlays = inject(Overlays);
	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _undos = signal(0);

	protected showToast() {
		this._overlays.toast('Event has been created', {
			description: 'Sunday, December 03, 2023 at 9:00 AM',
			action: { label: 'Undo', onClick: () => this._undos.update((count) => count + 1) },
		});
	}
}
