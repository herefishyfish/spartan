import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Haptics } from '@nativescript/haptics';

@Component({
	selector: 'switch-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		@for (option of _options; track option.id) {
			<div class="flex flex-row items-center gap-2" (click)="toggle(option.id)">
				<div
					data-slot="switch"
					data-size="default"
					class="spartan-switch group/switch inline-flex shrink-0 flex-row items-center"
					[attr.data-state]="_checked()[option.id] ? 'checked' : 'unchecked'"
				>
					<div
						data-slot="switch-thumb"
						class="spartan-switch-thumb block"
						[attr.data-state]="_checked()[option.id] ? 'checked' : 'unchecked'"
					></div>
				</div>
				<span class="text-sm font-medium">{{ option.label }}</span>
			</div>
		}
	`,
})
export default class SwitchDemo {
	protected readonly _options = [
		{ id: 'airplane', label: 'Airplane mode' },
		{ id: 'wifi', label: 'Wi-Fi' },
	];
	protected readonly _checked = signal<Record<string, boolean>>({ wifi: true });

	protected toggle(id: string) {
		Haptics.selection();
		this._checked.update((checked) => ({ ...checked, [id]: !checked[id] }));
	}
}
