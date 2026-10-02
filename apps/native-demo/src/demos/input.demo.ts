import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
	selector: 'input-demo',
	imports: [HlmInput, HlmFieldImports, HlmButton],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Basic</h3>
			<input hlmInput placeholder="Type something" [value]="_text()" (input)="_text.set($any($event).target.value)" />
			<p class="text-muted-foreground text-sm">{{ _text() ? 'You typed: ' + _text() : 'Nothing typed yet' }}</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Field</h3>
			<div hlmField>
				<label hlmFieldLabel>Username</label>
				<input
					hlmInput
					placeholder="Enter your username"
					[value]="_username()"
					(input)="_username.set($any($event).target.value)"
				/>
				<p hlmFieldDescription>
					{{ _username() ? 'spartan.ng/@' + _username() : 'Choose a unique username for your account.' }}
				</p>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Types</h3>
			<input
				hlmInput
				type="email"
				placeholder="Email"
				[value]="_email()"
				(input)="_email.set($any($event).target.value)"
			/>
			<input
				hlmInput
				type="password"
				placeholder="Password"
				[value]="_password()"
				(input)="_password.set($any($event).target.value)"
			/>
			<input hlmInput type="number" placeholder="Quantity" />
			<p class="text-muted-foreground text-sm">Password: {{ _password().length }} characters</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Invalid</h3>
			<div hlmField [forceInvalid]="_emailInvalid()">
				<label hlmFieldLabel>Email</label>
				<input
					hlmInput
					type="email"
					placeholder="you@example.com"
					[forceInvalid]="_emailInvalid()"
					[value]="_email()"
					(input)="_email.set($any($event).target.value)"
				/>
				@if (_emailInvalid()) {
					<hlm-field-error forceShow>Enter a valid email address.</hlm-field-error>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With button</h3>
			<div class="flex w-full flex-row items-center gap-2">
				<input
					hlmInput
					type="email"
					placeholder="Email"
					class="flex-1"
					[value]="_email()"
					(input)="_email.set($any($event).target.value)"
				/>
				<button hlmBtn variant="outline" [disabled]="_emailInvalid() || !_email()" (click)="_subscribed.set(_email())">
					Subscribe
				</button>
			</div>
			@if (_subscribed()) {
				<p class="text-muted-foreground text-sm">Subscribed {{ _subscribed() }}</p>
			}
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Disabled</h3>
			<input hlmInput placeholder="Disabled" [isEnabled]="false" />
		</section>
	`,
})
export default class InputDemo {
	protected readonly _text = signal('');
	protected readonly _username = signal('');
	protected readonly _email = signal('');
	protected readonly _password = signal('');
	protected readonly _subscribed = signal('');
	protected readonly _emailInvalid = computed(
		() => this._email().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email()),
	);
}
