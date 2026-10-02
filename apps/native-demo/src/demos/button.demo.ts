import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { type ButtonVariants, buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

@Component({
	selector: 'button-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Variants</h3>
			<div class="flex flex-row flex-wrap gap-2">
				@for (variant of _variants; track variant) {
					<button data-slot="button" [class]="_btn({ variant })" (click)="_clicks.set(_clicks() + 1)">
						{{ variant }}
					</button>
				}
			</div>
			<p class="text-muted-foreground text-sm">Tapped {{ _clicks() }} times</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Sizes</h3>
			<div class="flex flex-row flex-wrap items-center gap-2">
				<button [class]="_btn({ variant: 'outline', size: 'xs' })">Extra small</button>
				<button [class]="_btn({ variant: 'outline', size: 'sm' })">Small</button>
				<button [class]="_btn({ variant: 'outline' })">Default</button>
				<button [class]="_btn({ variant: 'outline', size: 'lg' })">Large</button>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With icons</h3>
			<div class="flex flex-row flex-wrap items-center gap-2">
				<button [class]="_btn({ variant: 'outline', size: 'icon' })"><ui-icon name="lucideArrowUp" /></button>
				<button [class]="_btn({})">
					<ui-icon name="lucideGitBranch" />
					<span>New branch</span>
				</button>
				<button [class]="_btn({ variant: 'secondary' })" [attr.data-disabled]="_loading() ? '' : null" (click)="load()">
					@if (_loading()) {
						<ui-icon name="lucideLoaderCircle" class="animate-spin" />
					}
					<span>{{ _loading() ? 'Please wait' : 'Submit' }}</span>
				</button>
			</div>
		</section>
	`,
})
export default class ButtonDemo {
	protected readonly _variants = ['default', 'secondary', 'outline', 'destructive', 'ghost', 'link'] as const;
	protected readonly _clicks = signal(0);
	protected readonly _loading = signal(false);
	protected readonly _btn = (variants: ButtonVariants) => buttonVariants(variants);

	protected load() {
		this._loading.set(true);
		setTimeout(() => this._loading.set(false), 1500);
	}
}
