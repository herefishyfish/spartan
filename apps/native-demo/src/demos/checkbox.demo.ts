import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Haptics } from '@nativescript/haptics';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmFieldDescription } from '@spartan-ng/helm/field';
import { HlmLabel } from '@spartan-ng/helm/label';

interface Option {
	readonly id: string;
	readonly label: string;
	readonly description?: string;
	readonly disabled?: boolean;
	readonly card?: boolean;
}

@Component({
	selector: 'checkbox-demo',
	imports: [HlmCheckbox, HlmLabel, HlmFieldDescription],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		@for (option of _options; track option.id) {
			<div
				class="flex flex-row items-start gap-3"
				[class.rounded-lg]="option.card"
				[class.border]="option.card"
				[class.p-3]="option.card"
				[class.border-primary]="option.card && _checked()[option.id]"
				[class.bg-muted]="option.card && _checked()[option.id]"
			>
				<hlm-checkbox
					[inputId]="option.id"
					[checked]="!!_checked()[option.id]"
					[disabled]="!!option.disabled"
					(checkedChange)="changed(option.id, $event)"
				/>
				<div class="flex flex-col gap-2" [class.opacity-50]="option.disabled">
					<!-- A native label does not forward taps to its control the way <label for> does. -->
					<label hlmLabel [attr.for]="option.id" (click)="toggle(option)">{{ option.label }}</label>
					@if (option.description) {
						<p hlmFieldDescription>{{ option.description }}</p>
					}
				</div>
			</div>
		}
	`,
})
export default class CheckboxDemo {
	protected readonly _options: readonly Option[] = [
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

	protected changed(id: string, checked: boolean) {
		Haptics.selection();
		this._checked.update((state) => ({ ...state, [id]: checked }));
	}

	protected toggle(option: Option) {
		if (!option.disabled) this.changed(option.id, !this._checked()[option.id]);
	}
}
