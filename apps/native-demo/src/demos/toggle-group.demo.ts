import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Haptics } from '@nativescript/haptics';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideBold,
	lucideItalic,
	lucideTextAlignCenter,
	lucideTextAlignEnd,
	lucideTextAlignStart,
	lucideUnderline,
} from '@ng-icons/lucide';
import { HlmToggleGroup, HlmToggleGroupItem } from '@spartan-ng/helm/toggle-group';

@Component({
	selector: 'toggle-group-demo',
	imports: [HlmToggleGroup, HlmToggleGroupItem, NgIcon],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [
		provideIcons({
			lucideBold,
			lucideItalic,
			lucideUnderline,
			lucideTextAlignStart,
			lucideTextAlignCenter,
			lucideTextAlignEnd,
		}),
	],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Multiple, outline</h3>
			<div hlmToggleGroup type="multiple" variant="outline" [value]="_format()" (valueChange)="changeFormat($event)">
				<button hlmToggleGroupItem value="bold" aria-label="Toggle bold">
					<ng-icon name="lucideBold" />
				</button>
				<button hlmToggleGroupItem value="italic" aria-label="Toggle italic">
					<ng-icon name="lucideItalic" />
				</button>
				<button hlmToggleGroupItem value="underline" aria-label="Toggle underline">
					<ng-icon name="lucideUnderline" />
				</button>
			</div>
			<p class="text-muted-foreground text-sm">Selected: {{ _format().join(', ') || 'none' }}</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Single, default</h3>
			<div hlmToggleGroup type="single" [value]="_align()" (valueChange)="changeAlign($event)">
				<button hlmToggleGroupItem value="left" aria-label="Align left">
					<ng-icon name="lucideTextAlignStart" />
				</button>
				<button hlmToggleGroupItem value="center" aria-label="Align center">
					<ng-icon name="lucideTextAlignCenter" />
				</button>
				<button hlmToggleGroupItem value="right" aria-label="Align right">
					<ng-icon name="lucideTextAlignEnd" />
				</button>
			</div>
			<p class="text-muted-foreground text-sm">Selected: {{ _align() ?? 'none' }}</p>
		</section>
	`,
})
export default class ToggleGroupDemo {
	protected readonly _format = signal<string[]>(['bold']);
	protected readonly _align = signal<string | null>('left');

	protected changeFormat(value: unknown) {
		Haptics.selection();
		this._format.set(value as string[]);
	}

	protected changeAlign(value: unknown) {
		Haptics.selection();
		this._align.set(value as string | null);
	}
}
