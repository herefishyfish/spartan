import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';

const TEXTAREA =
	'spartan-textarea placeholder:text-muted-foreground flex min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50';
const LABEL =
	'spartan-label flex items-center select-none spartan-field-label group/field-label peer/field-label flex w-fit';
const MAX_BIO = 120;

@Component({
	selector: 'textarea-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With button</h3>
			<div class="flex w-full flex-col gap-2">
				<textarea
					data-slot="textarea"
					placeholder="Type your message here."
					[class]="_textarea"
					[value]="_message()"
					(input)="_message.set($any($event).target.value)"
				></textarea>
				<button [class]="_primary" [attr.data-disabled]="_message().trim() ? null : ''" (click)="send()">
					Send message
				</button>
			</div>
			@for (sent of _sentMessages(); track $index) {
				<p class="text-muted-foreground text-sm">Sent: {{ sent }}</p>
			}
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Field</h3>
			<div
				role="group"
				data-slot="field"
				data-orientation="vertical"
				class="spartan-field group/field spartan-field-orientation-vertical flex w-full flex-col"
				[attr.data-matches-spartan-invalid]="_bioInvalid() ? 'true' : null"
			>
				<label data-slot="field-label" [class]="_label">Bio</label>
				<textarea
					data-slot="textarea"
					placeholder="Tell us a little bit about yourself"
					[class]="_textarea"
					[attr.data-matches-spartan-invalid]="_bioInvalid() ? 'true' : null"
					[value]="_bio()"
					(input)="_bio.set($any($event).target.value)"
				></textarea>
				@if (_bioInvalid()) {
					<p role="alert" data-slot="field-error" class="spartan-field-error font-normal">
						Keep it under {{ _maxBio }} characters ({{ _bio().length }}/{{ _maxBio }}).
					</p>
				} @else {
					<p data-slot="field-description" class="spartan-field-description leading-normal font-normal">
						{{ _bio().length }}/{{ _maxBio }} characters. You can mention other users with &#64;.
					</p>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Disabled</h3>
			<textarea
				data-slot="textarea"
				placeholder="Type your message here."
				[class]="_textarea"
				[isEnabled]="false"
			></textarea>
		</section>
	`,
})
export default class TextareaDemo {
	protected readonly _textarea = TEXTAREA;
	protected readonly _label = LABEL;
	protected readonly _maxBio = MAX_BIO;
	protected readonly _primary = buttonVariants({});

	protected readonly _message = signal('');
	protected readonly _sentMessages = signal<readonly string[]>([]);
	protected readonly _bio = signal('');
	protected readonly _bioInvalid = computed(() => this._bio().length > MAX_BIO);

	protected send() {
		const text = this._message().trim();
		if (!text) return;
		this._sentMessages.update((messages) => [...messages, text]);
		this._message.set('');
	}
}
