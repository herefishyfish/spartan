import { Component, DestroyRef, NO_ERRORS_SCHEMA, inject, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

@Component({
	selector: 'progress-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Animated</h3>
			<div data-slot="progress" role="progressbar" class="spartan-progress relative inline-flex w-full overflow-hidden">
				<div
					data-slot="progress-indicator"
					class="spartan-progress-indicator h-full transition-all"
					[style.width]="_loading() + '%'"
				></div>
			</div>
			<p class="text-muted-foreground text-sm">{{ _loading() === 100 ? 'Done' : 'Loading ' + _loading() + '%' }}</p>
			<button [class]="_outline" (click)="restart()">Restart</button>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With label</h3>
			<div class="flex w-full flex-row flex-wrap items-center gap-3">
				<span class="spartan-progress-label">Upload progress</span>
				<span class="spartan-progress-value">{{ _value() }}%</span>
				<div
					data-slot="progress"
					role="progressbar"
					class="spartan-progress relative inline-flex w-full overflow-hidden"
				>
					<div
						data-slot="progress-indicator"
						class="spartan-progress-indicator h-full transition-all"
						[style.width]="_value() + '%'"
					></div>
				</div>
			</div>
			<div class="flex flex-row gap-2">
				<button [class]="_icon" [attr.data-disabled]="_value() === 0 ? '' : null" (click)="step(-10)">
					<ui-icon name="lucideMinus" />
				</button>
				<button [class]="_icon" [attr.data-disabled]="_value() === 100 ? '' : null" (click)="step(10)">
					<ui-icon name="lucidePlus" />
				</button>
			</div>
		</section>
	`,
})
export default class ProgressDemo {
	protected readonly _loading = signal(0);
	protected readonly _value = signal(40);
	protected readonly _outline = buttonVariants({ variant: 'outline', size: 'sm' });
	protected readonly _icon = buttonVariants({ variant: 'outline', size: 'icon' });

	constructor() {
		const timer = setInterval(() => this._loading.update((value) => Math.min(value + 4, 100)), 120);
		inject(DestroyRef).onDestroy(() => clearInterval(timer));
	}

	protected restart() {
		this._loading.set(0);
	}

	protected step(delta: number) {
		this._value.update((value) => Math.min(Math.max(value + delta, 0), 100));
	}
}
