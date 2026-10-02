import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideImage } from '@ng-icons/lucide';
import { HlmAspectRatio } from '@spartan-ng/helm/aspect-ratio';

@Component({
	selector: 'aspect-ratio-demo',
	imports: [HlmAspectRatio, NgIcon],
	providers: [provideIcons({ lucideImage })],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">16 / 9</h3>
			<div [hlmAspectRatio]="16 / 9" class="w-full overflow-hidden rounded-lg">
				<img [src]="_src" class="absolute inset-0 size-full rounded-lg object-cover" />
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Square</h3>
			<div [hlmAspectRatio]="1" class="w-48 overflow-hidden rounded-lg">
				<img [src]="_src" class="absolute inset-0 size-full rounded-lg object-cover" />
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Portrait</h3>
			<div [hlmAspectRatio]="9 / 16" class="w-40 overflow-hidden rounded-lg">
				<img [src]="_src" class="absolute inset-0 size-full rounded-lg object-cover" />
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Without an image</h3>
			<div
				[hlmAspectRatio]="16 / 9"
				class="bg-muted text-muted-foreground flex w-full flex-col items-center justify-center gap-2 rounded-lg"
			>
				<ng-icon name="lucideImage" class="text-2xl" />
				<span class="text-sm">16 / 9</span>
			</div>
		</section>
	`,
})
export default class AspectRatioDemo {
	protected readonly _src = 'https://spartan.ng/assets/mountains.jpg';
}
