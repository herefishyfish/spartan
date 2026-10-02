import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
	selector: 'kbd-demo',
	imports: [HlmButton, HlmKbdImports],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col items-start gap-3">
			<h3 class="text-sm font-medium">Modifiers</h3>
			<kbd hlmKbdGroup>
				@for (key of _modifiers; track key) {
					<kbd hlmKbd>{{ key }}</kbd>
				}
			</kbd>
		</section>
		<section class="flex flex-col items-start gap-3">
			<h3 class="text-sm font-medium">Combination</h3>
			<kbd hlmKbdGroup>
				<kbd hlmKbd>Ctrl</kbd>
				<span>+</span>
				<kbd hlmKbd>B</kbd>
			</kbd>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Inline</h3>
			<p class="text-muted-foreground text-sm">
				Use
				<kbd hlmKbdGroup>
					<kbd hlmKbd>Ctrl + B</kbd>
					<kbd hlmKbd>Ctrl + K</kbd>
				</kbd>
				to open the command palette
			</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">In a button</h3>
			<div class="flex flex-row flex-wrap items-center gap-2">
				<button hlmBtn variant="outline" size="sm" class="pr-2" (click)="_accepted.set(!_accepted())">
					<span>{{ _accepted() ? 'Accepted' : 'Accept' }}</span>
					<kbd hlmKbd>⏎</kbd>
				</button>
				<button hlmBtn variant="outline" size="sm" class="pr-2">
					<span>Cancel</span>
					<kbd hlmKbd>Esc</kbd>
				</button>
			</div>
		</section>
	`,
})
export default class KbdDemo {
	protected readonly _modifiers = ['⌘', '⇧', '⌥', '⌃'];
	protected readonly _accepted = signal(false);
}
