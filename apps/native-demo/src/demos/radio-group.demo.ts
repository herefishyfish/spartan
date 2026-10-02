import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

interface Option {
	readonly id: string;
	readonly value: string;
	readonly label: string;
	readonly disabled?: boolean;
}

@Component({
	selector: 'radio-group-demo',
	imports: [HlmRadioGroupImports, HlmLabel],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div hlmRadioGroup [(value)]="_value">
			@for (option of _options; track option.id) {
				<div class="flex flex-row items-center gap-3">
					<hlm-radio [value]="option.value" [inputId]="option.id" [disabled]="!!option.disabled">
						<hlm-radio-indicator indicator />
					</hlm-radio>
					<!--
						A native label does not forward taps to its control the way <label for> does, and its
						peer-disabled:opacity-50 has no sibling input to match.
					-->
					<label hlmLabel [attr.for]="option.id" [class.opacity-50]="option.disabled" (click)="pick(option)">
						{{ option.label }}
					</label>
				</div>
			}
		</div>
		<p class="text-muted-foreground text-sm">Spacing: {{ _value() }}</p>
	`,
})
export default class RadioGroupDemo {
	protected readonly _options: readonly Option[] = [
		{ id: 'r1', value: 'default', label: 'Default', disabled: true },
		{ id: 'r2', value: 'comfortable', label: 'Comfortable' },
		{ id: 'r3', value: 'compact', label: 'Compact' },
	];
	protected readonly _value = signal('comfortable');

	protected pick(option: Option) {
		if (!option.disabled) this._value.set(option.value);
	}
}
