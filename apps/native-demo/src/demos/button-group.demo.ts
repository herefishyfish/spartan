import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

const GROUP =
	'spartan-button-group flex w-fit items-stretch spartan-button-group-orientation-horizontal [&>*:not(:first-child)]:rounded-s-none [&>*:not(:first-child)]:border-s-0 [&>*:not(:last-child)]:rounded-e-none';
const VERTICAL_GROUP =
	'spartan-button-group flex w-fit items-stretch spartan-button-group-orientation-vertical flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none';
const SEPARATOR =
	'spartan-button-group-separator relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto shrink-0 data-horizontal:h-px data-vertical:w-px data-vertical:self-stretch';

@Component({
	selector: 'button-group-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Nested groups</h3>
			<div role="group" data-slot="button-group" data-orientation="horizontal" [class]="_group + ' gap-2'">
				<div role="group" data-slot="button-group" data-orientation="horizontal" [class]="_group">
					<button data-slot="button" aria-label="Go Back" [class]="_outlineIcon" (click)="_action.set('Back')">
						<ui-icon name="lucideArrowLeft" />
					</button>
				</div>
				<div role="group" data-slot="button-group" data-orientation="horizontal" [class]="_group">
					<button data-slot="button" [class]="_outline" (click)="_action.set('Archived')">Archive</button>
					<button data-slot="button" [class]="_outline" (click)="_action.set('Reported')">Report</button>
				</div>
				<div role="group" data-slot="button-group" data-orientation="horizontal" [class]="_group">
					<button data-slot="button" [class]="_outline" (click)="_action.set('Snoozed')">Snooze</button>
					<button
						data-slot="button"
						aria-label="More Options"
						[class]="_outlineIcon"
						(click)="_action.set('More options')"
					>
						<ui-icon name="lucideEllipsis" />
					</button>
				</div>
			</div>
			<p class="text-muted-foreground text-sm">{{ _action() ?? 'Tap an action' }}</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Vertical</h3>
			<div class="flex flex-row items-center gap-3">
				<div role="group" data-slot="button-group" data-orientation="vertical" [class]="_verticalGroup">
					<button data-slot="button" aria-label="Zoom in" [class]="_outlineIcon" (click)="_zoom.set(_zoom() + 10)">
						<ui-icon name="lucidePlus" />
					</button>
					<button data-slot="button" aria-label="Zoom out" [class]="_outlineIcon" (click)="_zoom.set(_zoom() - 10)">
						<ui-icon name="lucideMinus" />
					</button>
				</div>
				<span class="text-sm font-medium">{{ _zoom() }}%</span>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Separator</h3>
			<div role="group" data-slot="button-group" data-orientation="horizontal" [class]="_group">
				<button data-slot="button" [class]="_secondary" (click)="_clipboard.set('Copied')">Copy</button>
				<div role="separator" data-slot="button-group-separator" data-orientation="vertical" [class]="_separator"></div>
				<button data-slot="button" [class]="_secondary" (click)="_clipboard.set('Pasted')">Paste</button>
			</div>
			<p class="text-muted-foreground text-sm">{{ _clipboard() ?? 'Nothing yet' }}</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Text and input</h3>
			<div role="group" data-slot="button-group" data-orientation="horizontal" [class]="_group + ' w-full'">
				<div data-slot="button-group-text" class="spartan-button-group-text flex flex-row items-center">
					<span>https://</span>
				</div>
				<input
					data-slot="input"
					placeholder="my-site"
					class="spartan-input w-full min-w-0 flex-1 outline-none"
					[value]="_site()"
					(input)="_site.set($any($event).target.value)"
				/>
				<button data-slot="button" [class]="_outlineIcon" aria-label="Visit" (click)="_visited.set(_site())">
					<ui-icon name="lucideArrowUpRight" />
				</button>
			</div>
			@if (_visited()) {
				<p class="text-muted-foreground text-sm">Visiting https://{{ _visited() }}</p>
			}
		</section>
	`,
})
export default class ButtonGroupDemo {
	protected readonly _group = GROUP;
	protected readonly _verticalGroup = VERTICAL_GROUP;
	protected readonly _separator = SEPARATOR;
	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _outlineIcon = buttonVariants({ variant: 'outline', size: 'icon' });
	protected readonly _secondary = buttonVariants({ variant: 'secondary' });

	protected readonly _action = signal<string | null>(null);
	protected readonly _zoom = signal(100);
	protected readonly _clipboard = signal<string | null>(null);
	protected readonly _site = signal('');
	protected readonly _visited = signal('');
}
