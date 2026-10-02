import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideCircleCheck, lucideInfo } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';

// spartan-alert lays out its icon and action through `has-[>ng-icon]:`, `has-data-[slot=alert-action]:` and
// `*:[ng-icon]:`, which NativeScript CSS cannot match, so those alerts repeat the resulting classes.
@Component({
	selector: 'alert-demo',
	imports: [HlmAlertImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideCircleAlert, lucideCircleCheck, lucideInfo })],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			@for (alert of _alerts; track alert.title) {
				<hlm-alert class="grid-cols-[auto_1fr] gap-x-2.5">
					<ng-icon [name]="alert.icon" class="row-span-2 translate-y-0.5 text-base" />
					<h4 hlmAlertTitle class="col-start-2">{{ alert.title }}</h4>
					<p hlmAlertDescription>{{ alert.body }}</p>
				</hlm-alert>
			}
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Destructive</h3>
			<hlm-alert variant="destructive" class="grid-cols-[auto_1fr] gap-x-2.5">
				<ng-icon name="lucideCircleAlert" class="row-span-2 translate-y-0.5 text-base" />
				<h4 hlmAlertTitle class="col-start-2">Payment failed</h4>
				<p hlmAlertDescription>Your payment could not be processed. Check your card details and try again.</p>
			</hlm-alert>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With action</h3>
			<hlm-alert class="pr-18">
				<h4 hlmAlertTitle>Dark mode is now available</h4>
				<p hlmAlertDescription>Enable it under your profile settings to get started.</p>
				<div hlmAlertAction class="right-3">
					<button hlmBtn size="xs" (click)="_enabled.set(!_enabled())">{{ _enabled() ? 'Disable' : 'Enable' }}</button>
				</div>
			</hlm-alert>
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
	protected readonly _enabled = signal(false);
}
