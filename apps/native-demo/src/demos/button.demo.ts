import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideGitBranch, lucideLoaderCircle } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'button-demo',
	imports: [HlmButton, NgIcon],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [provideIcons({ lucideArrowUp, lucideGitBranch, lucideLoaderCircle })],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Variants</h3>
			<div class="flex flex-row flex-wrap gap-2">
				@for (variant of _variants; track variant) {
					<button hlmBtn [variant]="variant" (click)="_clicks.set(_clicks() + 1)">
						{{ variant }}
					</button>
				}
			</div>
			<p class="text-muted-foreground text-sm">Tapped {{ _clicks() }} times</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Sizes</h3>
			<div class="flex flex-row flex-wrap items-center gap-2">
				<button hlmBtn variant="outline" size="xs">Extra small</button>
				<button hlmBtn variant="outline" size="sm">Small</button>
				<button hlmBtn variant="outline">Default</button>
				<button hlmBtn variant="outline" size="lg">Large</button>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With icons</h3>
			<div class="flex flex-row flex-wrap items-center gap-2">
				<button hlmBtn variant="outline" size="icon"><ng-icon name="lucideArrowUp" /></button>
				<button hlmBtn>
					<ng-icon name="lucideGitBranch" />
					<span>New branch</span>
				</button>
				<button hlmBtn variant="secondary" [disabled]="_loading()" (click)="load()">
					@if (_loading()) {
						<ng-icon name="lucideLoaderCircle" class="animate-spin" />
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

	protected load() {
		this._loading.set(true);
		setTimeout(() => this._loading.set(false), 1500);
	}
}
