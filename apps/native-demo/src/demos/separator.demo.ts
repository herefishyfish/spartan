import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';

@Component({
	selector: 'separator-demo',
	imports: [HlmSeparator],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Horizontal</h3>
			<div class="flex flex-col gap-4 text-sm">
				<div class="flex flex-col gap-1.5">
					<p class="leading-none font-medium">spartan/ui</p>
					<p class="text-muted-foreground">An open-source UI component library.</p>
				</div>
				<hlm-separator />
				<p>A set of beautifully designed components that you can customize, extend, and build on.</p>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Vertical</h3>
			<div class="flex h-5 flex-row items-center gap-4 text-sm">
				@for (link of _links; track link; let last = $last) {
					<span>{{ link }}</span>
					@if (!last) {
						<hlm-separator orientation="vertical" />
					}
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">List</h3>
			<div class="flex flex-col gap-2 text-sm">
				@for (row of _rows; track row.label; let last = $last) {
					<div class="flex flex-row items-center justify-between">
						<span>{{ row.label }}</span>
						<span class="text-muted-foreground">{{ row.value }}</span>
					</div>
					@if (!last) {
						<hlm-separator />
					}
				}
			</div>
		</section>
	`,
})
export default class SeparatorDemo {
	protected readonly _links = ['Blog', 'Docs', 'Source'];
	protected readonly _rows = [
		{ label: 'Item 1', value: 'Value 1' },
		{ label: 'Item 2', value: 'Value 2' },
		{ label: 'Item 3', value: 'Value 3' },
	];
}
