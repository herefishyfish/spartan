import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTabs, HlmTabsContent, HlmTabsList, HlmTabsTrigger } from '@spartan-ng/helm/tabs';

@Component({
	selector: 'tabs-demo',
	imports: [HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent, HlmCardImports, HlmButton, HlmInput, HlmLabel],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div hlmTabs class="w-full" [tab]="_active()" (tabActivated)="_active.set($event)">
			<div hlmTabsList class="flex-row">
				@for (tab of _tabs; track tab.id) {
					<button [hlmTabsTrigger]="tab.id">{{ tab.label }}</button>
				}
			</div>
			<!-- Brain hides inactive panels with the [hidden] property, which hides the native view but leaves its box in
			     MasonKit's layout; display: none removes it. -->
			@for (tab of _tabs; track tab.id) {
				<div [hlmTabsContent]="tab.id" [class.hidden]="_active() !== tab.id">
					<div hlmCard>
						<div hlmCardHeader class="grid-rows-[auto_auto]">
							<h3 hlmCardTitle>{{ tab.label }}</h3>
							<p hlmCardDescription>{{ tab.description }}</p>
						</div>
						<div hlmCardContent class="flex flex-col gap-4">
							@for (field of tab.fields; track field.label) {
								<div class="flex flex-col gap-1.5">
									<label hlmLabel>{{ field.label }}</label>
									<input
										hlmInput
										[attr.type]="field.type"
										[attr.placeholder]="field.placeholder"
										[value]="field.value"
									/>
								</div>
							}
						</div>
						<div hlmCardFooter>
							<button hlmBtn>{{ tab.action }}</button>
						</div>
					</div>
				</div>
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
}
