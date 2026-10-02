import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

@Component({
	selector: 'spinner-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Sizes</h3>
			<div class="flex flex-row items-center gap-6">
				@for (size of _sizes; track size) {
					<ui-icon
						data-slot="spinner"
						role="status"
						aria-label="Loading"
						name="lucideLoaderCircle"
						[class]="_spinner + ' ' + size"
					/>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Colors</h3>
			<div class="flex flex-row items-center gap-6">
				@for (color of _colors; track color) {
					<ui-icon
						data-slot="spinner"
						role="status"
						aria-label="Loading"
						name="lucideLoaderCircle"
						[class]="_spinner + ' text-2xl ' + color"
					/>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">In an item</h3>
			<div data-slot="item" data-variant="muted" data-size="default" [class]="_item">
				<div
					data-slot="item-media"
					data-variant="default"
					class="spartan-item-media spartan-item-media-variant-default flex shrink-0 items-center justify-center"
				>
					<ui-icon
						data-slot="spinner"
						role="status"
						aria-label="Loading"
						name="lucideLoaderCircle"
						[class]="_spinner + ' text-base'"
					/>
				</div>
				<div data-slot="item-content" class="spartan-item-content flex flex-1 flex-col">
					<span data-slot="item-title" class="spartan-item-title line-clamp-1 flex w-fit flex-row items-center">
						Processing payment...
					</span>
				</div>
				<div data-slot="item-content" class="spartan-item-content flex flex-none flex-col">
					<span class="text-sm tabular-nums">$100.00</span>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">In a button</h3>
			<div class="flex flex-row flex-wrap items-center gap-2">
				<button [class]="_btn" [attr.data-disabled]="_saving() ? '' : null" (click)="save()">
					@if (_saving()) {
						<ui-icon
							data-slot="spinner"
							role="status"
							aria-label="Loading"
							name="lucideLoaderCircle"
							[class]="_spinner + ' text-base'"
						/>
					}
					<span>{{ _saving() ? 'Saving' : 'Save' }}</span>
				</button>
			</div>
		</section>
	`,
})
export default class SpinnerDemo {
	protected readonly _sizes = ['text-xs', 'text-base', 'text-2xl', 'text-4xl'];
	protected readonly _colors = [
		'text-red-500',
		'text-green-500',
		'text-blue-500',
		'text-yellow-500',
		'text-purple-500',
	];
	protected readonly _spinner = 'inline-flex motion-safe:animate-spin animate-spin';
	protected readonly _item =
		'spartan-item group/item flex w-full flex-row flex-wrap items-center transition-colors duration-100 outline-none spartan-item-variant-muted spartan-item-size-default';
	protected readonly _btn = buttonVariants({ variant: 'outline' });
	protected readonly _saving = signal(false);

	protected save() {
		this._saving.set(true);
		setTimeout(() => this._saving.set(false), 1500);
	}
}
