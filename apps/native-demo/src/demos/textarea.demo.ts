import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmField, HlmFieldDescription, HlmFieldError, HlmFieldLabel } from '@spartan-ng/helm/field';
import { HlmTextarea } from '@spartan-ng/helm/textarea';

const MAX_BIO = 120;

@Component({
	selector: 'textarea-demo',
	imports: [HlmTextarea, HlmButton, HlmField, HlmFieldLabel, HlmFieldDescription, HlmFieldError],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With button</h3>
			<div class="flex w-full flex-col gap-2">
				<textarea
					hlmTextarea
					placeholder="Type your message here."
					[value]="_message()"
					(input)="_message.set($any($event).target.value)"
				></textarea>
				<button hlmBtn [disabled]="!_message().trim()" (click)="send()">Send message</button>
			</div>
			@for (sent of _sentMessages(); track $index) {
				<p class="text-muted-foreground text-sm">Sent: {{ sent }}</p>
			}
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Field</h3>
			<div hlmField [forceInvalid]="_bioInvalid()">
				<label hlmFieldLabel>Bio</label>
				<textarea
					hlmTextarea
					placeholder="Tell us a little bit about yourself"
					[forceInvalid]="_bioInvalid()"
					[value]="_bio()"
					(input)="_bio.set($any($event).target.value)"
				></textarea>
				@if (_bioInvalid()) {
					<hlm-field-error forceShow>
						Keep it under {{ _maxBio }} characters ({{ _bio().length }}/{{ _maxBio }}).
					</hlm-field-error>
				} @else {
					<p hlmFieldDescription>
						{{ _bio().length }}/{{ _maxBio }} characters. You can mention other users with &#64;.
					</p>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Disabled</h3>
			<textarea hlmTextarea placeholder="Type your message here." [isEnabled]="false"></textarea>
		</section>
	`,
})
export default class TextareaDemo {
	protected readonly _maxBio = MAX_BIO;

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
