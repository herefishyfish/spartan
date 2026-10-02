import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';

@Component({
	selector: 'skeleton-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Avatar</h3>
			<div class="flex flex-row items-center gap-4">
				<div data-slot="skeleton" [class]="_skeleton + ' size-12 rounded-full'"></div>
				<div class="flex flex-1 flex-col gap-2">
					<div data-slot="skeleton" [class]="_skeleton + ' h-4 w-full'"></div>
					<div data-slot="skeleton" [class]="_skeleton + ' h-4 w-4/5'"></div>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Card</h3>
			<div data-slot="card" data-size="default" class="spartan-card group/card flex w-full flex-col">
				<div data-slot="card-header" class="spartan-card-header group/card-header grid auto-rows-min items-start">
					<div data-slot="skeleton" [class]="_skeleton + ' h-4 w-2/3'"></div>
					<div data-slot="skeleton" [class]="_skeleton + ' h-4 w-1/2'"></div>
				</div>
				<div data-slot="card-content" class="spartan-card-content">
					<div data-slot="skeleton" [class]="_skeleton + ' aspect-video w-full'"></div>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Loading content</h3>
			@if (_loading()) {
				<div class="flex flex-col gap-2">
					<div data-slot="skeleton" [class]="_skeleton + ' h-4 w-full'"></div>
					<div data-slot="skeleton" [class]="_skeleton + ' h-4 w-full'"></div>
					<div data-slot="skeleton" [class]="_skeleton + ' h-4 w-3/4'"></div>
				</div>
			} @else {
				<p class="text-sm">
					Skeletons hold the shape of content while it loads, so the layout does not jump when it arrives.
				</p>
			}
			<button [class]="_btn" (click)="reload()">Reload</button>
		</section>
	`,
})
export default class SkeletonDemo {
	protected readonly _skeleton = 'spartan-skeleton block motion-safe:animate-pulse animate-pulse';
	protected readonly _btn = buttonVariants({ variant: 'outline', size: 'sm' }) + ' self-start';
	protected readonly _loading = signal(true);

	constructor() {
		this.reload();
	}

	protected reload() {
		this._loading.set(true);
		setTimeout(() => this._loading.set(false), 1500);
	}
}
