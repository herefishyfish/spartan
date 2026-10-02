import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmItem, HlmItemContent, HlmItemMedia, HlmItemTitle } from '@spartan-ng/helm/item';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spinner-demo',
	imports: [HlmSpinner, HlmButton, HlmItem, HlmItemMedia, HlmItemContent, HlmItemTitle],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Sizes</h3>
			<div class="flex flex-row items-center gap-6">
				<hlm-spinner class="text-xs" />
				<hlm-spinner class="text-base" />
				<hlm-spinner class="text-2xl" />
				<hlm-spinner class="text-4xl" />
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Colors</h3>
			<div class="flex flex-row items-center gap-6">
				<hlm-spinner class="text-2xl text-red-500" />
				<hlm-spinner class="text-2xl text-green-500" />
				<hlm-spinner class="text-2xl text-blue-500" />
				<hlm-spinner class="text-2xl text-yellow-500" />
				<hlm-spinner class="text-2xl text-purple-500" />
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">In an item</h3>
			<div hlmItem variant="muted">
				<div hlmItemMedia>
					<hlm-spinner class="text-base" />
				</div>
				<div hlmItemContent>
					<div hlmItemTitle>Processing payment...</div>
				</div>
				<div hlmItemContent>
					<span class="text-sm tabular-nums">$100.00</span>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">In a button</h3>
			<div class="flex flex-row flex-wrap items-center gap-2">
				<button hlmBtn variant="outline" [disabled]="_saving()" (click)="save()">
					@if (_saving()) {
						<hlm-spinner class="text-base" />
					}
					<span>{{ _saving() ? 'Saving' : 'Save' }}</span>
				</button>
			</div>
		</section>
	`,
})
export default class SpinnerDemo {
	protected readonly _saving = signal(false);

	protected save() {
		this._saving.set(true);
		setTimeout(() => this._saving.set(false), 1500);
	}
}
