import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpenCheck, lucideFilePen, lucideGitBranch, lucideSearch } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';

const STEPS = [
	{ icon: 'lucideSearch', text: 'Explored 4 files' },
	{ icon: 'lucideGitBranch', text: 'Switched to a new branch' },
	{ icon: 'lucideFilePen', text: 'Edited table.demo.ts' },
	{ icon: 'lucideBookOpenCheck', text: 'Syncing completed' },
] as const;

@Component({
	selector: 'marker-demo',
	imports: [HlmButton, HlmMarkerImports, NgIcon],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [provideIcons({ lucideBookOpenCheck, lucideFilePen, lucideGitBranch, lucideSearch })],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<!-- The separator variant draws its rules with ::before/::after, which do not render natively, so they are explicit children. -->
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Variants</h3>
			<div hlmMarker>
				<span hlmMarkerContent>A default marker for inline notes.</span>
			</div>
			<div hlmMarker variant="separator">
				<div class="bg-border me-1.5 h-px min-w-0 flex-1"></div>
				<span hlmMarkerContent>A separator marker</span>
				<div class="bg-border ms-1.5 h-px min-w-0 flex-1"></div>
			</div>
			<div hlmMarker variant="border">
				<span hlmMarkerContent>A border marker for row boundaries.</span>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With icon</h3>
			<div hlmMarker>
				<div hlmMarkerIcon><ng-icon name="lucideGitBranch" /></div>
				<span hlmMarkerContent>Switched to a new branch</span>
			</div>
			<div hlmMarker variant="separator">
				<div class="bg-border me-1.5 h-px min-w-0 flex-1"></div>
				<div hlmMarkerIcon><ng-icon name="lucideSearch" /></div>
				<span hlmMarkerContent>Explored 4 files</span>
				<div class="bg-border ms-1.5 h-px min-w-0 flex-1"></div>
			</div>
			<div hlmMarker class="flex-col">
				<div hlmMarkerIcon><ng-icon name="lucideBookOpenCheck" /></div>
				<span hlmMarkerContent>Syncing completed</span>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Activity</h3>
			@for (step of _steps(); track $index) {
				<div hlmMarker variant="border">
					<div hlmMarkerIcon><ng-icon [name]="step.icon" /></div>
					<span hlmMarkerContent>{{ step.text }}</span>
				</div>
			} @empty {
				<div hlmMarker>
					<span hlmMarkerContent>No activity yet.</span>
				</div>
			}
			<div class="flex flex-row gap-2">
				<button hlmBtn variant="outline" size="sm" [disabled]="_steps().length === _allSteps.length" (click)="next()">
					Run step
				</button>
				<button hlmBtn variant="ghost" size="sm" (click)="_steps.set([])">Clear</button>
			</div>
		</section>
	`,
})
export default class MarkerDemo {
	protected readonly _allSteps = STEPS;
	protected readonly _steps = signal<readonly (typeof STEPS)[number][]>([]);

	protected next() {
		this._steps.update((steps) => (steps.length < STEPS.length ? [...steps, STEPS[steps.length]] : steps));
	}
}
