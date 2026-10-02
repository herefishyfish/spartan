import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';

@Component({
	selector: 'skeleton-demo',
	imports: [HlmButton, HlmCardImports, HlmSkeleton],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Avatar</h3>
			<div class="flex flex-row items-center gap-4">
				<hlm-skeleton class="size-12 rounded-full" />
				<div class="flex flex-1 flex-col gap-2">
					<hlm-skeleton class="h-4 w-full" />
					<hlm-skeleton class="h-4 w-4/5" />
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Card</h3>
			<div hlmCard class="w-full">
				<div hlmCardHeader>
					<hlm-skeleton class="h-4 w-2/3" />
					<hlm-skeleton class="h-4 w-1/2" />
				</div>
				<div hlmCardContent>
					<hlm-skeleton class="aspect-video w-full" />
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Loading content</h3>
			@if (_loading()) {
				<div class="flex flex-col gap-2">
					<hlm-skeleton class="h-4 w-full" />
					<hlm-skeleton class="h-4 w-full" />
					<hlm-skeleton class="h-4 w-3/4" />
				</div>
			} @else {
				<p class="text-sm">
					Skeletons hold the shape of content while it loads, so the layout does not jump when it arrives.
				</p>
			}
			<button hlmBtn variant="outline" size="sm" class="self-start" (click)="reload()">Reload</button>
		</section>
	`,
})
export default class SkeletonDemo {
	protected readonly _loading = signal(true);

	constructor() {
		this.reload();
	}

	protected reload() {
		this._loading.set(true);
		setTimeout(() => this._loading.set(false), 1500);
	}
}
