import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';

@Component({
	selector: 'kbd-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col items-start gap-3">
			<h3 class="text-sm font-medium">Modifiers</h3>
			<kbd data-slot="kbd-group" [class]="_group">
				@for (key of _modifiers; track key) {
					<kbd data-slot="kbd" [class]="_kbd">{{ key }}</kbd>
				}
			</kbd>
		</section>
		<section class="flex flex-col items-start gap-3">
			<h3 class="text-sm font-medium">Combination</h3>
			<kbd data-slot="kbd-group" [class]="_group">
				<kbd data-slot="kbd" [class]="_kbd">Ctrl</kbd>
				<span>+</span>
				<kbd data-slot="kbd" [class]="_kbd">B</kbd>
			</kbd>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Inline</h3>
			<p class="text-muted-foreground text-sm">
				Use
				<kbd data-slot="kbd-group" [class]="_group">
					<kbd data-slot="kbd" [class]="_kbd">Ctrl + B</kbd>
					<kbd data-slot="kbd" [class]="_kbd">Ctrl + K</kbd>
				</kbd>
				to open the command palette
			</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">In a button</h3>
			<div class="flex flex-row flex-wrap items-center gap-2">
				<button [class]="_outline" (click)="_accepted.set(!_accepted())">
					<span>{{ _accepted() ? 'Accepted' : 'Accept' }}</span>
					<kbd data-slot="kbd" [class]="_kbd">⏎</kbd>
				</button>
				<button [class]="_outline">
					<span>Cancel</span>
					<kbd data-slot="kbd" [class]="_kbd">Esc</kbd>
				</button>
			</div>
		</section>
	`,
})
export default class KbdDemo {
	protected readonly _modifiers = ['⌘', '⇧', '⌥', '⌃'];
	protected readonly _accepted = signal(false);
	protected readonly _group = 'spartan-kbd-group inline-flex flex-row items-center';
	protected readonly _kbd =
		'spartan-kbd pointer-events-none inline-flex flex-row items-center justify-center select-none';
	protected readonly _outline = buttonVariants({ variant: 'outline' });
}
