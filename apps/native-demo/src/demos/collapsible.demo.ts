import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { hlm } from '@spartan-ng/helm/utils';
import { Icon } from '../ui/icon';

@Component({
	selector: 'collapsible-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="collapsible" class="flex w-full flex-col gap-2" [attr.data-state]="_state()">
			<div class="flex flex-row items-center justify-between gap-4 px-4">
				<h4 class="text-sm font-semibold">Order #4189</h4>
				<button
					data-slot="collapsible-trigger"
					[class]="_trigger"
					[attr.data-state]="_state()"
					[attr.aria-expanded]="_open()"
					(click)="_open.set(!_open())"
				>
					<ui-icon name="lucideChevronsUpDown" />
				</button>
			</div>
			<div class="flex flex-row items-center justify-between rounded-md border px-4 py-2 text-sm">
				<span class="text-muted-foreground">Status</span>
				<span class="font-medium">Shipped</span>
			</div>
			@if (_open()) {
				<div data-slot="collapsible-content" class="flex flex-col gap-2" [attr.data-state]="_state()">
					@for (row of _rows; track row.label) {
						<div class="flex flex-col rounded-md border px-4 py-2 text-sm">
							<p class="font-medium">{{ row.label }}</p>
							<p class="text-muted-foreground">{{ row.value }}</p>
						</div>
					}
				</div>
			}
		</div>
	`,
})
export default class CollapsibleDemo {
	protected readonly _rows = [
		{ label: 'Shipping address', value: '100 Market St, San Francisco' },
		{ label: 'Items', value: '2x Studio Headphones' },
	];
	protected readonly _open = signal(false);
	protected readonly _state = computed(() => (this._open() ? 'open' : 'closed'));
	protected readonly _trigger = hlm(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-8');
}
