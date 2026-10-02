import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

@Component({
	selector: 'alert-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			@for (alert of _alerts; track alert.title) {
				<div
					data-slot="alert"
					role="alert"
					class="spartan-alert group/alert spartan-alert-variant-default relative w-full grid-cols-[auto_1fr] gap-x-2.5"
				>
					<ui-icon [name]="alert.icon" class="row-span-2 translate-y-0.5 text-base" />
					<h4 data-slot="alert-title" [class]="_title + ' col-start-2'">{{ alert.title }}</h4>
					<p data-slot="alert-description" [class]="_description">{{ alert.body }}</p>
				</div>
			}
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Destructive</h3>
			<div
				data-slot="alert"
				role="alert"
				class="spartan-alert group/alert spartan-alert-variant-destructive relative w-full grid-cols-[auto_1fr] gap-x-2.5"
			>
				<ui-icon name="lucideCircleAlert" class="row-span-2 translate-y-0.5 text-base" />
				<h4 data-slot="alert-title" [class]="_title + ' col-start-2'">Payment failed</h4>
				<p data-slot="alert-description" [class]="_description">
					Your payment could not be processed. Check your card details and try again.
				</p>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With action</h3>
			<div
				data-slot="alert"
				role="alert"
				class="spartan-alert group/alert spartan-alert-variant-default relative w-full pr-18"
			>
				<h4 data-slot="alert-title" [class]="_title">Dark mode is now available</h4>
				<p data-slot="alert-description" [class]="_description">
					Enable it under your profile settings to get started.
				</p>
				<div data-slot="alert-action" class="spartan-alert-action right-3">
					<button [class]="_btn" (click)="_enabled.set(!_enabled())">{{ _enabled() ? 'Disable' : 'Enable' }}</button>
				</div>
			</div>
		</section>
	`,
})
export default class AlertDemo {
	protected readonly _alerts = [
		{
			icon: 'lucideCircleCheck',
			title: 'Payment successful',
			body: 'Your payment of $29.99 has been processed. A receipt has been sent to your email address.',
		},
		{
			icon: 'lucideInfo',
			title: 'New feature available',
			body: "We've added dark mode support. You can enable it in your account settings.",
		},
	] as const;
	protected readonly _title =
		'spartan-alert-title [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3';
	protected readonly _description =
		'spartan-alert-description [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3';
	protected readonly _btn = buttonVariants({ size: 'xs' });
	protected readonly _enabled = signal(false);
}
