import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Icon } from '../ui/icon';

@Component({
	selector: 'aspect-ratio-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		@for (ratio of _ratios; track ratio.label) {
			<section class="flex flex-col gap-3">
				<h3 class="text-sm font-medium">{{ ratio.label }}</h3>
				<div data-slot="aspect-ratio" [class]="'relative overflow-hidden rounded-lg ' + ratio.class">
					<img
						src="https://spartan.ng/assets/mountains.jpg"
						class="absolute inset-0 size-full rounded-lg object-cover"
					/>
				</div>
			</section>
		}
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Without an image</h3>
			<div
				data-slot="aspect-ratio"
				class="bg-muted text-muted-foreground relative flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg"
			>
				<ui-icon name="lucideImage" class="text-2xl" />
				<span class="text-sm">16 / 9</span>
			</div>
		</section>
	`,
})
export default class AspectRatioDemo {
	protected readonly _ratios = [
		{ label: '16 / 9', class: 'aspect-video w-full' },
		{ label: 'Square', class: 'aspect-square w-48' },
		{ label: 'Portrait', class: 'aspect-[9/16] w-40' },
	];
}
