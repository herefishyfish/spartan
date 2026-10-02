import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Haptics } from '@nativescript/haptics';
import { type ToggleVariants, toggleVariants } from '@spartan-ng/helm/toggle';
import { type IconName, Icon } from '../ui/icon';

type Group = {
	id: string;
	title: string;
	type: 'single' | 'multiple';
	variant: ToggleVariants['variant'];
	items: { value: string; icon: IconName }[];
};

@Component({
	selector: 'toggle-group-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		@for (group of _groups; track group.id) {
			<section class="flex flex-col gap-3">
				<h3 class="text-sm font-medium">{{ group.title }}</h3>
				<div
					role="group"
					data-slot="toggle-group"
					data-size="default"
					data-spacing="0"
					data-orientation="horizontal"
					class="spartan-toggle-group group/toggle-group flex w-fit flex-row items-center"
					[attr.data-variant]="group.variant"
				>
					@for (item of group.items; track item.value; let first = $first, last = $last) {
						<button
							data-slot="toggle-group-item"
							data-size="default"
							data-spacing="0"
							[class]="_itemClass(group)"
							[attr.data-variant]="group.variant"
							[attr.data-edge]="first ? 'first' : last ? 'last' : null"
							[attr.aria-label]="'Toggle ' + item.value"
							[attr.data-state]="isOn(group, item.value) ? 'on' : 'off'"
							(click)="press(group, item.value)"
						>
							<ui-icon [name]="item.icon" />
						</button>
					}
				</div>
				<p class="text-muted-foreground text-sm">{{ summary(group) }}</p>
			</section>
		}
	`,
})
export default class ToggleGroupDemo {
	protected readonly _groups: Group[] = [
		{
			id: 'format',
			title: 'Multiple, outline',
			type: 'multiple',
			variant: 'outline',
			items: [
				{ value: 'lucideBold', icon: 'lucideBold' },
				{ value: 'lucideItalic', icon: 'lucideItalic' },
				{ value: 'lucideUnderline', icon: 'lucideUnderline' },
			],
		},
		{
			id: 'align',
			title: 'Single, default',
			type: 'single',
			variant: 'default',
			items: [
				{ value: 'left', icon: 'lucideTextAlignStart' },
				{ value: 'center', icon: 'lucideTextAlignCenter' },
				{ value: 'right', icon: 'lucideTextAlignEnd' },
			],
		},
	];
	protected readonly _selected = signal<Record<string, readonly string[]>>({ format: ['bold'], align: ['left'] });

	protected readonly _itemClass = ({ variant }: Group) =>
		'spartan-toggle-group-item shrink-0 focus:z-10 focus-visible:z-10 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-s-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-s group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t ' +
		toggleVariants({ variant, size: 'default' });

	protected isOn(group: Group, value: string) {
		return this._selected()[group.id].includes(value);
	}

	protected summary(group: Group) {
		return `Selected: ${this._selected()[group.id].join(', ') || 'none'}`;
	}

	protected press(group: Group, value: string) {
		Haptics.selection();
		this._selected.update((selected) => {
			const current = selected[group.id];
			const next =
				group.type === 'single'
					? current.includes(value)
						? []
						: [value]
					: current.includes(value)
						? current.filter((v) => v !== value)
						: [...current, value];
			return { ...selected, [group.id]: next };
		});
	}
}
