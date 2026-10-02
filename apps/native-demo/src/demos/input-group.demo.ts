import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideCheck, lucideCopy, lucideSearch } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

const FRAMEWORKS = ['Angular', 'Analog', 'NativeScript', 'Nx', 'Tailwind CSS', 'TanStack', 'Vite', 'Vitest'];

@Component({
	selector: 'input-group-demo',
	imports: [HlmInputGroupImports, NgIcon],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [provideIcons({ lucideArrowUp, lucideCheck, lucideCopy, lucideSearch })],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Icon and text</h3>
			<div hlmInputGroup>
				<div hlmInputGroupAddon>
					<ng-icon name="lucideSearch" />
				</div>
				<input
					hlmInputGroupInput
					placeholder="Search..."
					[value]="_query()"
					(input)="_query.set($any($event).target.value)"
				/>
				<div hlmInputGroupAddon align="inline-end">
					<span>{{ _results().length }} results</span>
				</div>
			</div>
			<p class="text-muted-foreground text-sm">{{ _results().join(', ') || 'No matches' }}</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Text addons</h3>
			<div hlmInputGroup>
				<div hlmInputGroupAddon>
					<span hlmInputGroupText>https://</span>
				</div>
				<input
					hlmInputGroupInput
					placeholder="example"
					[value]="_domain()"
					(input)="_domain.set($any($event).target.value)"
				/>
				<div hlmInputGroupAddon align="inline-end">
					<span hlmInputGroupText>.com</span>
				</div>
			</div>
			<p class="text-muted-foreground text-sm">https://{{ _domain() || 'example' }}.com</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Button</h3>
			<div hlmInputGroup>
				<input hlmInputGroupInput [value]="_url" />
				<div hlmInputGroupAddon align="inline-end">
					<button hlmInputGroupButton size="icon-xs" aria-label="Copy" (click)="copy()">
						<ng-icon [name]="_copied() ? 'lucideCheck' : 'lucideCopy'" />
					</button>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Textarea</h3>
			<!-- h-auto flex-col stand in for spartan's has-[>[data-align=block-end]] rules, which need :has(). -->
			<div hlmInputGroup class="h-auto flex-col">
				<textarea
					hlmInputGroupTextarea
					placeholder="Ask, search or chat..."
					[value]="_message()"
					(input)="_message.set($any($event).target.value)"
				></textarea>
				<div hlmInputGroupAddon align="block-end">
					<span hlmInputGroupText>{{ _message().length }}/280</span>
					<button
						hlmInputGroupButton
						variant="default"
						size="icon-xs"
						aria-label="Send"
						class="ml-auto rounded-full"
						[disabled]="!_message().trim()"
						(click)="send()"
					>
						<ng-icon name="lucideArrowUp" />
					</button>
				</div>
			</div>
			@for (sent of _sentMessages(); track $index) {
				<p class="text-muted-foreground text-sm">Sent: {{ sent }}</p>
			}
		</section>
	`,
})
export default class InputGroupDemo {
	protected readonly _url = 'https://spartan.ng/components/input-group';

	protected readonly _query = signal('');
	protected readonly _results = computed(() =>
		FRAMEWORKS.filter((name) => name.toLowerCase().includes(this._query().trim().toLowerCase())),
	);
	protected readonly _domain = signal('');
	protected readonly _copied = signal(false);
	protected readonly _message = signal('');
	protected readonly _sentMessages = signal<readonly string[]>([]);

	protected copy() {
		this._copied.set(true);
		setTimeout(() => this._copied.set(false), 1500);
	}

	protected send() {
		const text = this._message().trim();
		if (!text) return;
		this._sentMessages.update((messages) => [...messages, text]);
		this._message.set('');
	}
}
