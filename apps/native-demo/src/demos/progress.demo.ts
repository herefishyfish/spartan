import { Component, DestroyRef, NO_ERRORS_SCHEMA, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmProgress } from '@spartan-ng/helm/progress';

@Component({
	selector: 'progress-demo',
	imports: [HlmProgress, HlmButton, NgIcon],
	providers: [provideIcons({ lucideMinus, lucidePlus })],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<!--
			The indicator mirrors hlmProgressIndicator, which offsets a full-width fill with translateX(-n%). NativeScript
			transforms take no percentages, so the fill is sized by width instead.
		-->
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Animated</h3>
			<div hlmProgress [value]="_loading()">
				<div
					data-slot="progress-indicator"
					class="spartan-progress-indicator h-full transition-all"
					[style.width]="_loading() + '%'"
				></div>
			</div>
			<p class="text-muted-foreground text-sm">{{ _loading() === 100 ? 'Done' : 'Loading ' + _loading() + '%' }}</p>
			<button hlmBtn variant="outline" size="sm" (click)="restart()">Restart</button>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With label</h3>
			<div class="flex w-full flex-row flex-wrap items-center gap-3">
				<span class="spartan-progress-label">Upload progress</span>
				<span class="spartan-progress-value">{{ _value() }}%</span>
				<div hlmProgress [value]="_value()">
					<div
						data-slot="progress-indicator"
						class="spartan-progress-indicator h-full transition-all"
						[style.width]="_value() + '%'"
					></div>
				</div>
			</div>
			<div class="flex flex-row gap-2">
				<button hlmBtn variant="outline" size="icon" [disabled]="_value() === 0" (click)="step(-10)">
					<ng-icon name="lucideMinus" />
				</button>
				<button hlmBtn variant="outline" size="icon" [disabled]="_value() === 100" (click)="step(10)">
					<ng-icon name="lucidePlus" />
				</button>
			</div>
		</section>
	`,
})
export default class ProgressDemo {
	protected readonly _loading = signal(0);
	protected readonly _value = signal(40);

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
