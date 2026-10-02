import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';

const INPUT =
	'spartan-input placeholder:text-muted-foreground w-full min-w-0 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';
const LABEL =
	'spartan-label flex items-center select-none spartan-field-label group/field-label peer/field-label flex w-fit';

@Component({
	selector: 'input-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Basic</h3>
			<input
				data-slot="input"
				placeholder="Type something"
				[class]="_input"
				[value]="_text()"
				(input)="_text.set($any($event).target.value)"
			/>
			<p class="text-muted-foreground text-sm">{{ _text() ? 'You typed: ' + _text() : 'Nothing typed yet' }}</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Field</h3>
			<div
				role="group"
				data-slot="field"
				data-orientation="vertical"
				class="spartan-field group/field spartan-field-orientation-vertical flex w-full flex-col"
			>
				<label data-slot="field-label" [class]="_label">Username</label>
				<input
					data-slot="input"
					placeholder="Enter your username"
					[class]="_input"
					[value]="_username()"
					(input)="_username.set($any($event).target.value)"
				/>
				<p data-slot="field-description" class="spartan-field-description leading-normal font-normal">
					{{ _username() ? 'spartan.ng/@' + _username() : 'Choose a unique username for your account.' }}
				</p>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Types</h3>
			<input
				data-slot="input"
				type="email"
				placeholder="Email"
				[class]="_input"
				[value]="_email()"
				(input)="_email.set($any($event).target.value)"
			/>
			<input
				data-slot="input"
				type="password"
				placeholder="Password"
				[class]="_input"
				[value]="_password()"
				(input)="_password.set($any($event).target.value)"
			/>
			<input data-slot="input" type="number" placeholder="Quantity" [class]="_input" />
			<p class="text-muted-foreground text-sm">Password: {{ _password().length }} characters</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Invalid</h3>
			<div
				role="group"
				data-slot="field"
				data-orientation="vertical"
				class="spartan-field group/field spartan-field-orientation-vertical flex w-full flex-col"
				[attr.data-matches-spartan-invalid]="_emailInvalid() ? 'true' : null"
			>
				<label data-slot="field-label" [class]="_label">Email</label>
				<input
					data-slot="input"
					type="email"
					placeholder="you@example.com"
					[class]="_input"
					[attr.aria-invalid]="_emailInvalid() ? 'true' : null"
					[attr.data-matches-spartan-invalid]="_emailInvalid() ? 'true' : null"
					[value]="_email()"
					(input)="_email.set($any($event).target.value)"
				/>
				@if (_emailInvalid()) {
					<p role="alert" data-slot="field-error" class="spartan-field-error font-normal">
						Enter a valid email address.
					</p>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With button</h3>
			<div class="flex w-full flex-row items-center gap-2">
				<input
					data-slot="input"
					type="email"
					placeholder="Email"
					[class]="_input + ' flex-1'"
					[value]="_email()"
					(input)="_email.set($any($event).target.value)"
				/>
				<button
					[class]="_outline"
					[attr.data-disabled]="_emailInvalid() || !_email() ? '' : null"
					(click)="_subscribed.set(_email())"
				>
					Subscribe
				</button>
			</div>
			@if (_subscribed()) {
				<p class="text-muted-foreground text-sm">Subscribed {{ _subscribed() }}</p>
			}
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Disabled</h3>
			<input data-slot="input" placeholder="Disabled" [class]="_input" [isEnabled]="false" />
		</section>
	`,
})
export default class InputDemo {
	protected readonly _input = INPUT;
	protected readonly _label = LABEL;
	protected readonly _outline = buttonVariants({ variant: 'outline' });

	protected readonly _text = signal('');
	protected readonly _username = signal('');
	protected readonly _email = signal('');
	protected readonly _password = signal('');
	protected readonly _subscribed = signal('');
	protected readonly _emailInvalid = computed(
		() => this._email().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email()),
	);
}
