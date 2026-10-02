import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';

@Component({
	selector: 'radio-group-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="radio-group" role="radiogroup" class="spartan-radio-group">
			@for (option of _options; track option.value) {
				<div
					class="flex flex-row items-center gap-3"
					[class.opacity-50]="option.disabled"
					(click)="option.disabled || _value.set(option.value)"
				>
					<div
						data-slot="radio-group-item"
						class="group relative flex items-center gap-x-3"
						[attr.data-checked]="_value() === option.value ? 'true' : 'false'"
						[attr.data-disabled]="option.disabled ? 'true' : 'false'"
					>
						<div data-slot="indicator" class="flex h-fit w-fit">
							<div
								data-slot="radio-group-indicator"
								class="border-input text-primary relative flex aspect-square size-4 shrink-0 items-center justify-center rounded-full border shadow-xs outline-none"
							>
								<div class="group-data-[checked=true]:bg-primary size-2 rounded-full bg-transparent"></div>
							</div>
						</div>
					</div>
					<label data-slot="label" class="spartan-label select-none">{{ option.label }}</label>
				</div>
			}
		</div>
		<p class="text-muted-foreground text-sm">Spacing: {{ _value() }}</p>
	`,
})
export default class RadioGroupDemo {
	protected readonly _options = [
		{ value: 'default', label: 'Default', disabled: true },
		{ value: 'comfortable', label: 'Comfortable' },
		{ value: 'compact', label: 'Compact' },
	];
	protected readonly _value = signal('comfortable');
}
