import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Icon } from '../ui/icon';

@Component({
	selector: 'label-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With a checkbox</h3>
			<div class="flex flex-row items-center gap-2" (click)="_terms.set(!_terms())">
				<div
					data-slot="checkbox"
					class="spartan-checkbox peer shrink-0 cursor-default outline-none disabled:cursor-not-allowed disabled:opacity-50"
					[attr.data-state]="_terms() ? 'checked' : 'unchecked'"
				>
					@if (_terms()) {
						<div class="spartan-checkbox-indicator flex items-center justify-center text-current transition-none">
							<ui-icon name="lucideCheck" class="text-sm" />
						</div>
					}
				</div>
				<label data-slot="label" [class]="_label">Accept terms and conditions</label>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With an input</h3>
			<div class="flex flex-col gap-2">
				<label data-slot="label" [class]="_label">Username</label>
				<input
					data-slot="input"
					[class]="_input"
					placeholder="spartan"
					[value]="_username()"
					(input)="_username.set($any($event).target.value)"
				/>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Disabled</h3>
			<div class="group flex flex-col gap-2" data-disabled="true">
				<label data-slot="label" [class]="_label">Email (locked)</label>
				<input data-slot="input" [class]="_input + ' opacity-50'" value="team@spartan.ng" [isEnabled]="false" />
			</div>
		</section>
	`,
})
export default class LabelDemo {
	protected readonly _terms = signal(false);
	protected readonly _username = signal('');
	protected readonly _label =
		'spartan-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed';
	protected readonly _input =
		'spartan-input file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';
}
