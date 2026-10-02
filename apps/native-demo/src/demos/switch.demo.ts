import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Haptics } from '@nativescript/haptics';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'switch-demo',
	imports: [HlmSwitch, HlmLabel],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		@for (option of _options; track option.id) {
			<div class="flex flex-row items-center gap-2">
				<hlm-switch
					[inputId]="option.id"
					[checked]="!!_checked()[option.id]"
					(checkedChange)="toggled(option.id, $event)"
				/>
				<label hlmLabel [attr.for]="option.id">{{ option.label }}</label>
			</div>
		}
		<div class="flex flex-row items-center gap-2">
			<hlm-switch inputId="disabled" disabled />
			<label hlmLabel for="disabled">Disabled</label>
		</div>
		<p class="text-muted-foreground text-sm">Wi-Fi is {{ _checked()['wifi'] ? 'on' : 'off' }}</p>
	`,
})
export default class SwitchDemo {
	protected readonly _options = [
		{ id: 'airplane', label: 'Airplane mode' },
		{ id: 'wifi', label: 'Wi-Fi' },
	];
	protected readonly _checked = signal<Record<string, boolean>>({ wifi: true });

	protected toggled(id: string, checked: boolean) {
		Haptics.selection();
		this._checked.update((state) => ({ ...state, [id]: checked }));
	}
}
