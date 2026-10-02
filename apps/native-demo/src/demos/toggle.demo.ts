import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Haptics } from '@nativescript/haptics';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideBookmark, lucideItalic } from '@ng-icons/lucide';
import { HlmToggle, type ToggleVariants } from '@spartan-ng/helm/toggle';

type ToggleState = 'on' | 'off';

@Component({
	selector: 'toggle-demo',
	imports: [HlmToggle, NgIcon],
	providers: [provideIcons({ lucideBold, lucideBookmark, lucideItalic })],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		@for (item of _items; track item.id) {
			<section class="flex flex-col gap-3">
				<h3 class="text-sm font-medium">{{ item.title }}</h3>
				<div class="flex flex-row items-center gap-2">
					<button
						hlmToggle
						[variant]="item.variant"
						[size]="item.size"
						[aria-label]="'Toggle ' + item.id"
						[state]="_state()[item.id]"
						(stateChange)="changed(item.id, $event)"
					>
						<ng-icon [name]="item.icon" />
						@if (item.label) {
							<span>{{ item.label }}</span>
						}
					</button>
					<span class="text-muted-foreground text-sm">{{ _state()[item.id] === 'on' ? 'On' : 'Off' }}</span>
				</div>
			</section>
		}
	`,
})
export default class ToggleDemo {
	protected readonly _items: {
		id: string;
		title: string;
		icon: string;
		label?: string;
		variant: ToggleVariants['variant'];
		size: ToggleVariants['size'];
	}[] = [
		{ id: 'bookmark', title: 'Outline', icon: 'lucideBookmark', label: 'Bookmark', variant: 'outline', size: 'sm' },
		{ id: 'italic', title: 'Default', icon: 'lucideItalic', variant: 'default', size: 'default' },
		{ id: 'bold', title: 'Large', icon: 'lucideBold', label: 'Bold', variant: 'outline', size: 'lg' },
	];
	protected readonly _state = signal<Record<string, ToggleState>>({ bookmark: 'on', italic: 'off', bold: 'off' });

	protected changed(id: string, state: ToggleState) {
		Haptics.selection();
		this._state.update((current) => ({ ...current, [id]: state }));
	}
}
