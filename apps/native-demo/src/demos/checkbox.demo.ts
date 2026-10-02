import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Haptics } from '@nativescript/haptics';
import { Icon } from '../ui/icon';

@Component({
	selector: 'checkbox-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		@for (option of _options; track option.id) {
			<div
				class="flex flex-row items-start gap-3"
				[class.opacity-50]="option.disabled"
				[class.rounded-lg]="option.card"
				[class.border]="option.card"
				[class.p-3]="option.card"
				[class.border-primary]="option.card && _checked()[option.id]"
				[class.bg-muted]="option.card && _checked()[option.id]"
				(click)="toggle(option)"
			>
				<div
					role="button"
					data-slot="checkbox"
					class="spartan-checkbox peer shrink-0"
					[attr.data-state]="_checked()[option.id] ? 'checked' : 'unchecked'"
					[attr.data-disabled]="option.disabled ? '' : null"
				>
					@if (_checked()[option.id]) {
						<span class="spartan-checkbox-indicator flex items-center justify-center text-current transition-none">
							<ui-icon name="lucideCheck" class="text-sm" />
						</span>
					}
				</div>
				<div class="flex flex-col gap-2">
					<label data-slot="label" class="spartan-label select-none">{{ option.label }}</label>
					@if (option.description) {
						<p data-slot="field-description" class="spartan-field-description leading-normal font-normal">
							{{ option.description }}
						</p>
					}
				</div>
			</div>
		}
	`,
})
export default class CheckboxDemo {
	protected readonly _options = [
		{ id: 'terms', label: 'Accept terms and conditions' },
		{
			id: 'terms-2',
			label: 'Accept terms and conditions',
			description: 'By clicking this checkbox, you agree to the terms and conditions.',
		},
		{ id: 'toggle', label: 'Enable notifications', disabled: true },
		{
			id: 'toggle-2',
			label: 'Enable notifications',
			description: 'You can enable or disable notifications at any time.',
			card: true,
		},
	];
	protected readonly _checked = signal<Record<string, boolean>>({ 'terms-2': true, 'toggle-2': true });

	protected toggle(option: { id: string; disabled?: boolean }) {
		if (option.disabled) return;
		Haptics.selection();
		this._checked.update((checked) => ({ ...checked, [option.id]: !checked[option.id] }));
	}
}
