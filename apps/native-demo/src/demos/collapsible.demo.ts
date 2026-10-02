import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';

@Component({
	selector: 'collapsible-demo',
	imports: [HlmCollapsibleImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideChevronsUpDown })],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div hlmCollapsible class="flex w-full flex-col gap-2">
			<div class="flex flex-row items-center justify-between gap-4 px-4">
				<h4 class="text-sm font-semibold">Order #4189</h4>
				<button hlmCollapsibleTrigger hlmBtn variant="ghost" size="icon" class="size-8">
					<ng-icon name="lucideChevronsUpDown" />
				</button>
			</div>
			<div class="flex flex-row items-center justify-between rounded-md border px-4 py-2 text-sm">
				<span class="text-muted-foreground">Status</span>
				<span class="font-medium">Shipped</span>
			</div>
			<div hlmCollapsibleContent class="flex flex-col gap-2">
				@for (row of _rows; track row.label) {
					<div class="flex flex-col rounded-md border px-4 py-2 text-sm">
						<p class="font-medium">{{ row.label }}</p>
						<p class="text-muted-foreground">{{ row.value }}</p>
					</div>
				}
			</div>
		</div>
	`,
})
export default class CollapsibleDemo {
	protected readonly _rows = [
		{ label: 'Shipping address', value: '100 Market St, San Francisco' },
		{ label: 'Items', value: '2x Studio Headphones' },
	];
}
