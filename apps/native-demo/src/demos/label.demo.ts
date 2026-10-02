import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'label-demo',
	imports: [HlmCheckbox, HlmInput, HlmLabel],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With a checkbox</h3>
			<div class="flex flex-row items-center gap-2">
				<hlm-checkbox inputId="terms" [checked]="_terms()" (checkedChange)="_terms.set($event)" />
				<!-- A native label does not forward taps to its control the way <label for> does. -->
				<label hlmLabel for="terms" (click)="_terms.set(!_terms())">Accept terms and conditions</label>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With an input</h3>
			<div class="flex flex-col gap-2">
				<label hlmLabel for="username">Username</label>
				<input
					hlmInput
					id="username"
					placeholder="spartan"
					[value]="_username()"
					(input)="_username.set($any($event).target.value)"
				/>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Disabled</h3>
			<div class="group flex flex-col gap-2" data-disabled="true">
				<label hlmLabel for="email">Email (locked)</label>
				<input hlmInput id="email" class="opacity-50" value="team@spartan.ng" [isEnabled]="false" />
			</div>
		</section>
	`,
})
export default class LabelDemo {
	protected readonly _terms = signal(false);
	protected readonly _username = signal('');
}
