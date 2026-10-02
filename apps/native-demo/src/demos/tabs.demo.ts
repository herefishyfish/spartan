import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { listVariants } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'tabs-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="tabs" data-orientation="horizontal" class="group/tabs flex w-full flex-col gap-2">
			<div role="tablist" data-slot="tabs-list" data-variant="default" class="flex-row" [class]="_list">
				@for (tab of _tabs; track tab.id) {
					<button
						role="tab"
						data-slot="tabs-trigger"
						data-orientation="horizontal"
						[class]="_trigger"
						[attr.data-state]="_active() === tab.id ? 'active' : 'inactive'"
						(click)="_active.set(tab.id)"
					>
						{{ tab.label }}
					</button>
				}
			</div>
			@for (tab of _tabs; track tab.id) {
				@if (_active() === tab.id) {
					<div
						role="tabpanel"
						data-slot="tabs-content"
						data-state="active"
						data-orientation="horizontal"
						class="flex-1 text-sm outline-none"
					>
						<div data-slot="card" class="spartan-card group/card flex flex-col">
							<div data-slot="card-header" class="spartan-card-header group/card-header grid auto-rows-min items-start">
								<h3 data-slot="card-title" class="spartan-card-title">{{ tab.label }}</h3>
								<p data-slot="card-description" class="spartan-card-description">{{ tab.description }}</p>
							</div>
							<div data-slot="card-content" class="spartan-card-content flex flex-col gap-4">
								@for (field of tab.fields; track field.label) {
									<div class="flex flex-col gap-1.5">
										<label data-slot="label" class="spartan-label select-none">{{ field.label }}</label>
										<input
											data-slot="input"
											class="spartan-input w-full min-w-0 outline-none"
											[attr.type]="field.type"
											[attr.placeholder]="field.placeholder"
											[value]="field.value"
										/>
									</div>
								}
							</div>
							<div data-slot="card-footer" class="spartan-card-footer flex flex-row items-center">
								<button data-slot="button" [class]="_button">{{ tab.action }}</button>
							</div>
						</div>
					</div>
				}
			}
		</div>
	`,
})
export default class TabsDemo {
	protected readonly _tabs = [
		{
			id: 'account',
			label: 'Account',
			description: "Make changes to your account here. Click save when you're done.",
			action: 'Save Changes',
			fields: [
				{ label: 'Name', type: 'text', value: 'Pedro Duarte', placeholder: null },
				{ label: 'Username', type: 'text', value: '', placeholder: '@peduarte' },
			],
		},
		{
			id: 'password',
			label: 'Password',
			description: "Change your password here. After saving, you'll be logged out.",
			action: 'Save Password',
			fields: [
				{ label: 'Old Password', type: 'password', value: '', placeholder: null },
				{ label: 'New Password', type: 'password', value: '', placeholder: null },
			],
		},
	];
	protected readonly _active = signal('account');
	protected readonly _list = listVariants({ variant: 'default' });
	protected readonly _button = buttonVariants();
	protected readonly _trigger =
		'spartan-tabs-trigger text-foreground/60 relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap transition-all data-active:bg-background data-active:text-foreground';
}
