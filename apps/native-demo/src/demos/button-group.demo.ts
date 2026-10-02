import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowUpRight, lucideEllipsis, lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
	selector: 'button-group-demo',
	imports: [HlmButtonGroupImports, HlmButton, HlmInput, NgIcon],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [provideIcons({ lucideArrowLeft, lucideArrowUpRight, lucideEllipsis, lucideMinus, lucidePlus })],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Nested groups</h3>
			<!-- gap-2 stands in for spartan's has-[>[data-slot=button-group]]:gap-2, which needs :has(). -->
			<div hlmButtonGroup class="gap-2">
				<div hlmButtonGroup>
					<button hlmBtn variant="outline" size="icon" aria-label="Go Back" (click)="_action.set('Back')">
						<ng-icon name="lucideArrowLeft" />
					</button>
				</div>
				<div hlmButtonGroup>
					<button hlmBtn variant="outline" (click)="_action.set('Archived')">Archive</button>
					<button hlmBtn variant="outline" (click)="_action.set('Reported')">Report</button>
				</div>
				<div hlmButtonGroup>
					<button hlmBtn variant="outline" (click)="_action.set('Snoozed')">Snooze</button>
					<button hlmBtn variant="outline" size="icon" aria-label="More Options" (click)="_action.set('More options')">
						<ng-icon name="lucideEllipsis" />
					</button>
				</div>
			</div>
			<p class="text-muted-foreground text-sm">{{ _action() ?? 'Tap an action' }}</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Vertical</h3>
			<div class="flex flex-row items-center gap-3">
				<div hlmButtonGroup orientation="vertical" aria-label="Zoom controls">
					<button hlmBtn variant="outline" size="icon" aria-label="Zoom in" (click)="_zoom.set(_zoom() + 10)">
						<ng-icon name="lucidePlus" />
					</button>
					<button hlmBtn variant="outline" size="icon" aria-label="Zoom out" (click)="_zoom.set(_zoom() - 10)">
						<ng-icon name="lucideMinus" />
					</button>
				</div>
				<span class="text-sm font-medium">{{ _zoom() }}%</span>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Separator</h3>
			<div hlmButtonGroup>
				<button hlmBtn variant="secondary" (click)="_clipboard.set('Copied')">Copy</button>
				<div hlmButtonGroupSeparator></div>
				<button hlmBtn variant="secondary" (click)="_clipboard.set('Pasted')">Paste</button>
			</div>
			<p class="text-muted-foreground text-sm">{{ _clipboard() ?? 'Nothing yet' }}</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Text and input</h3>
			<div hlmButtonGroup class="w-full">
				<div hlmButtonGroupText>
					<span>https://</span>
				</div>
				<input
					hlmInput
					placeholder="my-site"
					class="flex-1"
					[value]="_site()"
					(input)="_site.set($any($event).target.value)"
				/>
				<button hlmBtn variant="outline" size="icon" aria-label="Visit" (click)="_visited.set(_site())">
					<ng-icon name="lucideArrowUpRight" />
				</button>
			</div>
			@if (_visited()) {
				<p class="text-muted-foreground text-sm">Visiting https://{{ _visited() }}</p>
			}
		</section>
	`,
})
export default class ButtonGroupDemo {
	protected readonly _action = signal<string | null>(null);
	protected readonly _zoom = signal(100);
	protected readonly _clipboard = signal<string | null>(null);
	protected readonly _site = signal('');
	protected readonly _visited = signal('');
}
