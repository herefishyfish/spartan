import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon, type IconName } from '../ui/icon';

type MarkerVariant = 'default' | 'separator' | 'border';

const MARKER = 'spartan-marker group/marker relative flex flex-row min-h-4 w-full items-center text-start text-sm';
const VARIANT: Record<MarkerVariant, string> = {
	default: 'spartan-marker-variant-default',
	separator: 'spartan-marker-variant-separator',
	border: 'spartan-marker-variant-border',
};
const CONTENT =
	'spartan-marker-content wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center';

const STEPS: readonly { icon: IconName; text: string }[] = [
	{ icon: 'lucideSearch', text: 'Explored 4 files' },
	{ icon: 'lucideGitBranch', text: 'Switched to a new branch' },
	{ icon: 'lucideFilePen', text: 'Edited table.demo.ts' },
	{ icon: 'lucideBookOpenCheck', text: 'Syncing completed' },
];

@Component({
	selector: 'marker-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Variants</h3>
			<div data-slot="marker" data-variant="default" [class]="marker('default')">
				<span data-slot="marker-content" [class]="_content">A default marker for inline notes.</span>
			</div>
			<div data-slot="marker" data-variant="separator" [class]="marker('separator')">
				<div class="bg-border me-1.5 h-px min-w-0 flex-1"></div>
				<span data-slot="marker-content" [class]="_content">A separator marker</span>
				<div class="bg-border ms-1.5 h-px min-w-0 flex-1"></div>
			</div>
			<div data-slot="marker" data-variant="border" [class]="marker('border')">
				<span data-slot="marker-content" [class]="_content">A border marker for row boundaries.</span>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With icon</h3>
			<div data-slot="marker" data-variant="default" [class]="marker('default')">
				<ui-icon name="lucideGitBranch" data-slot="marker-icon" aria-hidden="true" class="spartan-marker-icon" />
				<span data-slot="marker-content" [class]="_content">Switched to a new branch</span>
			</div>
			<div data-slot="marker" data-variant="separator" [class]="marker('separator')">
				<div class="bg-border me-1.5 h-px min-w-0 flex-1"></div>
				<ui-icon name="lucideSearch" data-slot="marker-icon" aria-hidden="true" class="spartan-marker-icon" />
				<span data-slot="marker-content" [class]="_content">Explored 4 files</span>
				<div class="bg-border ms-1.5 h-px min-w-0 flex-1"></div>
			</div>
			<div data-slot="marker" data-variant="default" [class]="marker('default') + ' flex-col'">
				<ui-icon name="lucideBookOpenCheck" data-slot="marker-icon" aria-hidden="true" class="spartan-marker-icon" />
				<span data-slot="marker-content" [class]="_content">Syncing completed</span>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Activity</h3>
			@for (step of _steps(); track $index) {
				<div data-slot="marker" data-variant="border" [class]="marker('border')">
					<ui-icon data-slot="marker-icon" aria-hidden="true" class="spartan-marker-icon" [name]="step.icon" />
					<span data-slot="marker-content" [class]="_content">{{ step.text }}</span>
				</div>
			} @empty {
				<div data-slot="marker" data-variant="default" [class]="marker('default')">
					<span data-slot="marker-content" [class]="_content">No activity yet.</span>
				</div>
			}
			<div class="flex flex-row gap-2">
				<button
					[class]="_outline"
					[attr.data-disabled]="_steps().length === _allSteps.length ? '' : null"
					(click)="next()"
				>
					Run step
				</button>
				<button [class]="_ghost" (click)="_steps.set([])">Clear</button>
			</div>
		</section>
	`,
})
export default class MarkerDemo {
	protected readonly _content = CONTENT;
	protected readonly _allSteps = STEPS;
	protected readonly _steps = signal<readonly (typeof STEPS)[number][]>([]);
	protected readonly _outline = buttonVariants({ variant: 'outline', size: 'sm' });
	protected readonly _ghost = buttonVariants({ variant: 'ghost', size: 'sm' });

	protected marker(variant: MarkerVariant) {
		return `${MARKER} ${VARIANT[variant]}`;
	}

	protected next() {
		this._steps.update((steps) => (steps.length < STEPS.length ? [...steps, STEPS[steps.length]] : steps));
	}
}
