import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'card-demo',
	imports: [HlmCardImports, HlmButton, HlmInput, HlmLabel],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<!-- Card headers spell out the grid tracks spartan sets with has-data-[slot=...], which needs :has(). -->
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			<div hlmCard>
				<div hlmCardHeader class="grid-cols-[1fr_auto] grid-rows-[auto_auto]">
					<h3 hlmCardTitle>Login to your account</h3>
					<p hlmCardDescription>Enter your email below to login to your account</p>
					<div hlmCardAction>
						<button hlmBtn variant="link">Sign Up</button>
					</div>
				</div>
				<div hlmCardContent>
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<label hlmLabel>Email</label>
							<input
								hlmInput
								placeholder="m@example.com"
								[value]="_email()"
								(input)="_email.set($any($event).target.value)"
							/>
						</div>
						<div class="grid gap-2">
							<div class="flex flex-row items-center">
								<label hlmLabel>Password</label>
								<a class="ml-auto inline-block text-sm underline-offset-4">Forgot your password?</a>
							</div>
							<input hlmInput type="password" />
						</div>
					</div>
				</div>
				<div hlmCardFooter class="flex-col gap-2">
					<button hlmBtn class="w-full" (click)="_submitted.set(_email())">Login</button>
					<button hlmBtn variant="outline" class="w-full">Login with Google</button>
				</div>
			</div>
			@if (_submitted()) {
				<p class="text-muted-foreground text-sm">Logging in as {{ _submitted() }}</p>
			}
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Small</h3>
			<div hlmCard size="sm">
				<div hlmCardHeader class="grid-rows-[auto_auto]">
					<h3 hlmCardTitle>Small Card</h3>
					<p hlmCardDescription>This card uses the small size variant.</p>
				</div>
				<div hlmCardContent>
					<p>The card component supports a size input that can be set to "sm" for a more compact appearance.</p>
				</div>
				<div hlmCardFooter>
					<button hlmBtn variant="outline" size="sm" class="w-full">Action</button>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With image</h3>
			<!-- pt-0 and rounded-t-xl stand in for spartan's has-[>img:first-child]:pt-0 and *:[img:first-child] rules. -->
			<div hlmCard class="pt-0">
				<img src="https://spartan.ng/assets/mountains.jpg" class="aspect-video w-full rounded-t-xl object-cover" />
				<div hlmCardHeader class="grid-rows-[auto_auto]">
					<h3 hlmCardTitle>Mountain retreat</h3>
					<p hlmCardDescription>Three nights in the Alps, breakfast included.</p>
				</div>
				<div hlmCardFooter>
					<button hlmBtn class="w-full">Book now</button>
				</div>
			</div>
		</section>
	`,
})
export default class CardDemo {
	protected readonly _email = signal('');
	protected readonly _submitted = signal('');
}
