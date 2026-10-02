import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Haptics } from '@nativescript/haptics';
import { type ToggleVariants, toggleVariants } from '@spartan-ng/helm/toggle';
import { type IconName, Icon } from '../ui/icon';

@Component({
	selector: 'toggle-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		@for (item of _items; track item.id) {
			<section class="flex flex-col gap-3">
				<h3 class="text-sm font-medium">{{ item.title }}</h3>
				<div class="flex flex-row items-center gap-2">
					<button
						data-slot="toggle"
						[class]="_toggle(item)"
						[attr.aria-label]="'Toggle ' + item.id"
						[attr.aria-pressed]="_pressed()[item.id] ? 'true' : 'false'"
						[attr.data-state]="_pressed()[item.id] ? 'on' : 'off'"
						(click)="flip(item.id)"
					>
						<ui-icon [name]="item.icon" />
						@if (item.label) {
							<span>{{ item.label }}</span>
						}
					</button>
					<span class="text-muted-foreground text-sm">{{ _pressed()[item.id] ? 'On' : 'Off' }}</span>
				</div>
			</section>
		}
	`,
})
export default class ToggleDemo {
	protected readonly _items: {
		id: string;
		title: string;
		icon: IconName;
		label?: string;
		variant: ToggleVariants['variant'];
		size: ToggleVariants['size'];
	}[] = [
		{
			id: 'lucideBookmark',
			title: 'Outline',
			icon: 'lucideBookmark',
			label: 'Bookmark',
			variant: 'outline',
			size: 'sm',
		},
		{ id: 'lucideItalic', title: 'Default', icon: 'lucideItalic', variant: 'default', size: 'default' },
		{ id: 'lucideBold', title: 'Large', icon: 'lucideBold', label: 'Bold', variant: 'outline', size: 'lg' },
	];
	protected readonly _pressed = signal<Record<string, boolean>>({ bookmark: true });
	protected readonly _toggle = ({ variant, size }: ToggleVariants) => toggleVariants({ variant, size });

	protected flip(id: string) {
		Haptics.selection();
		this._pressed.update((pressed) => ({ ...pressed, [id]: !pressed[id] }));
	}
}
