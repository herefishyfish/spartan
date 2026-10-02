import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

const GROUP = 'group/input-group spartan-input-group relative flex w-full min-w-0 flex-row items-center outline-none';
const ADDON = 'spartan-input-group-addon flex flex-row cursor-text items-center justify-center select-none';
const INLINE_START = `${ADDON} spartan-input-group-addon-align-inline-start order-first`;
const INLINE_END = `${ADDON} spartan-input-group-addon-align-inline-end order-last`;
const BLOCK_END = `${ADDON} spartan-input-group-addon-align-block-end order-last w-full justify-start`;
const CONTROL =
	'spartan-input placeholder:text-muted-foreground w-full min-w-0 outline-none spartan-input-group-input flex-1';
const TEXTAREA =
	'spartan-textarea placeholder:text-muted-foreground flex min-h-16 w-full outline-none spartan-input-group-textarea flex-1 resize-none';

const FRAMEWORKS = ['Angular', 'Analog', 'NativeScript', 'Nx', 'Tailwind CSS', 'TanStack', 'Vite', 'Vitest'];

@Component({
	selector: 'input-group-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Icon and text</h3>
			<div role="group" data-slot="input-group" [class]="_group">
				<div role="group" data-slot="input-group-addon" data-align="inline-start" [class]="_inlineStart">
					<ui-icon name="lucideSearch" />
				</div>
				<input
					data-slot="input-group-control"
					placeholder="Search..."
					[class]="_control"
					[value]="_query()"
					(input)="_query.set($any($event).target.value)"
				/>
				<div role="group" data-slot="input-group-addon" data-align="inline-end" [class]="_inlineEnd">
					<span>{{ _results().length }} results</span>
				</div>
			</div>
			<p class="text-muted-foreground text-sm">{{ _results().join(', ') || 'No matches' }}</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Text addons</h3>
			<div role="group" data-slot="input-group" [class]="_group">
				<div role="group" data-slot="input-group-addon" data-align="inline-start" [class]="_inlineStart">
					<span class="spartan-input-group-text flex items-center">https://</span>
				</div>
				<input
					data-slot="input-group-control"
					placeholder="example"
					[class]="_control"
					[value]="_domain()"
					(input)="_domain.set($any($event).target.value)"
				/>
				<div role="group" data-slot="input-group-addon" data-align="inline-end" [class]="_inlineEnd">
					<span class="spartan-input-group-text flex items-center">.com</span>
				</div>
			</div>
			<p class="text-muted-foreground text-sm">https://{{ _domain() || 'example' }}.com</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Button</h3>
			<div role="group" data-slot="input-group" [class]="_group">
				<input data-slot="input-group-control" [class]="_control" [value]="_url" />
				<div role="group" data-slot="input-group-addon" data-align="inline-end" [class]="_inlineEnd">
					<button data-size="icon-xs" [class]="_iconButton" (click)="copy()">
						<ui-icon [name]="_copied() ? 'lucideCheck' : 'lucideCopy'" />
					</button>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Textarea</h3>
			<div role="group" data-slot="input-group" [class]="_group + ' h-auto flex-col'">
				<textarea
					data-slot="input-group-control"
					placeholder="Ask, search or chat..."
					[class]="_textarea"
					[value]="_message()"
					(input)="_message.set($any($event).target.value)"
				></textarea>
				<div role="group" data-slot="input-group-addon" data-align="block-end" [class]="_blockEnd">
					<span class="spartan-input-group-text flex items-center">{{ _message().length }}/280</span>
					<div class="flex-1"></div>
					<button
						data-size="icon-xs"
						[class]="_sendButton"
						[attr.data-disabled]="_message().trim() ? null : ''"
						(click)="send()"
					>
						<ui-icon name="lucideArrowUp" />
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
	protected readonly _group = GROUP;
	protected readonly _inlineStart = INLINE_START;
	protected readonly _inlineEnd = INLINE_END;
	protected readonly _blockEnd = BLOCK_END;
	protected readonly _control = CONTROL;
	protected readonly _textarea = TEXTAREA;
	protected readonly _iconButton = `${buttonVariants({ variant: 'ghost' })} spartan-input-group-button flex items-center shadow-none spartan-input-group-button-size-icon-xs`;
	protected readonly _sendButton = `${buttonVariants({ variant: 'default' })} spartan-input-group-button flex items-center shadow-none spartan-input-group-button-size-icon-xs rounded-full`;
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
