import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { type ButtonVariants, buttonVariants } from '@spartan-ng/helm/button';

@Component({
	selector: 'card-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			<div data-slot="card" data-size="default" [class]="_card">
				<div data-slot="card-header" [class]="_header + ' grid-cols-[1fr_auto] grid-rows-[auto_auto]'">
					<h3 data-slot="card-title" class="spartan-card-title">Login to your account</h3>
					<p data-slot="card-description" class="spartan-card-description">
						Enter your email below to login to your account
					</p>
					<div data-slot="card-action" [class]="_action">
						<button [class]="_btn({ variant: 'link' })">Sign Up</button>
					</div>
				</div>
				<div data-slot="card-content" class="spartan-card-content">
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<label data-slot="label" [class]="_label">Email</label>
							<input
								data-slot="input"
								[class]="_input"
								placeholder="m@example.com"
								[value]="_email()"
								(input)="_email.set($any($event).target.value)"
							/>
						</div>
						<div class="grid gap-2">
							<div class="flex flex-row items-center">
								<label data-slot="label" [class]="_label">Password</label>
								<a class="ml-auto inline-block text-sm underline-offset-4">Forgot your password?</a>
							</div>
							<input data-slot="input" type="password" [class]="_input" />
						</div>
					</div>
				</div>
				<div data-slot="card-footer" class="spartan-card-footer flex flex-col items-center gap-2">
					<button [class]="_btn({}) + ' w-full'" (click)="_submitted.set(_email())">Login</button>
					<button [class]="_btn({ variant: 'outline' }) + ' w-full'">Login with Google</button>
				</div>
			</div>
			@if (_submitted()) {
				<p class="text-muted-foreground text-sm">Logging in as {{ _submitted() }}</p>
			}
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Small</h3>
			<div data-slot="card" data-size="sm" [class]="_card">
				<div data-slot="card-header" [class]="_header + ' grid-rows-[auto_auto]'">
					<h3 data-slot="card-title" class="spartan-card-title">Small Card</h3>
					<p data-slot="card-description" class="spartan-card-description">This card uses the small size variant.</p>
				</div>
				<div data-slot="card-content" class="spartan-card-content">
					<p>The card component supports a size input that can be set to "sm" for a more compact appearance.</p>
				</div>
				<div data-slot="card-footer" class="spartan-card-footer flex flex-row items-center">
					<button [class]="_btn({ variant: 'outline', size: 'sm' }) + ' w-full'">Action</button>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With image</h3>
			<div data-slot="card" data-size="default" [class]="_card + ' pt-0'">
				<img src="https://spartan.ng/assets/mountains.jpg" class="aspect-video w-full rounded-t-xl object-cover" />
				<div data-slot="card-header" [class]="_header + ' grid-rows-[auto_auto]'">
					<h3 data-slot="card-title" class="spartan-card-title">Mountain retreat</h3>
					<p data-slot="card-description" class="spartan-card-description">
						Three nights in the Alps, breakfast included.
					</p>
				</div>
				<div data-slot="card-footer" class="spartan-card-footer flex flex-row items-center">
					<button [class]="_btn({}) + ' w-full'">Book now</button>
				</div>
			</div>
		</section>
	`,
})
export default class CardDemo {
	protected readonly _email = signal('');
	protected readonly _submitted = signal('');
	protected readonly _card = 'spartan-card group/card flex flex-col';
	protected readonly _header =
		'spartan-card-header group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]';
	protected readonly _action = 'spartan-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end';
	protected readonly _label =
		'spartan-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed';
	protected readonly _input =
		'spartan-input file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';
	protected readonly _btn = (variants: ButtonVariants) => buttonVariants(variants);
}
