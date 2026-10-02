import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import type { MenuAction, MenuSelectedEvent } from '@nstudio/nativescript-menu';
import { Icon } from '../ui/icon';
import { nativeMenu } from '../ui/menu';

interface Option {
	readonly value: string;
	readonly label: string;
}

const STATUSES: readonly Option[] = [
	{ value: 'todo', label: 'Todo' },
	{ value: 'in-progress', label: 'In Progress' },
	{ value: 'done', label: 'Done' },
	{ value: 'cancelled', label: 'Cancelled' },
];

const PRIORITIES: readonly Option[] = [
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' },
];

/** A `<select>` opens the platform picker, so the options open in a native menu anchored to the field. */
const menuFor = (options: readonly Option[], selected: string) =>
	nativeMenu<string>([
		{
			name: '',
			childrenStyle: 'inline',
			singleSelection: true,
			children: options.map(({ value, label }) => ({ name: label, value, state: value === selected ? 'on' : 'off' })),
		},
	]);

@Component({
	selector: 'native-select-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			<div
				data-slot="native-select-wrapper"
				data-size="default"
				class="spartan-native-select-wrapper group/native-select relative w-fit"
				[menu]="_statusMenu()"
				(selected)="_status.set(value($any($event)))"
			>
				<div
					role="button"
					data-slot="native-select"
					data-size="default"
					class="spartan-native-select flex flex-row items-center outline-none"
				>
					<span [class.text-muted-foreground]="!_status()">{{ _statusLabel() }}</span>
				</div>
				<ui-icon
					name="lucideChevronDown"
					data-slot="native-select-icon"
					aria-hidden="true"
					class="spartan-native-select-icon pointer-events-none absolute select-none"
				/>
			</div>
			<p class="text-muted-foreground text-sm">Value: {{ _status() || '(none)' }}</p>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Small</h3>
			<div
				data-slot="native-select-wrapper"
				data-size="sm"
				class="spartan-native-select-wrapper group/native-select relative w-fit"
				[menu]="_priorityMenu()"
				(selected)="_priority.set(value($any($event)))"
			>
				<div
					role="button"
					data-slot="native-select"
					data-size="sm"
					class="spartan-native-select flex flex-row items-center outline-none"
				>
					<span>{{ _priorityLabel() }}</span>
				</div>
				<ui-icon
					name="lucideChevronDown"
					data-slot="native-select-icon"
					aria-hidden="true"
					class="spartan-native-select-icon pointer-events-none absolute select-none"
				/>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Disabled</h3>
			<div
				data-slot="native-select-wrapper"
				data-size="default"
				class="spartan-native-select-wrapper group/native-select relative w-fit opacity-50"
			>
				<div
					role="button"
					data-slot="native-select"
					data-size="default"
					class="spartan-native-select flex flex-row items-center outline-none"
				>
					<span>Disabled</span>
				</div>
				<ui-icon
					name="lucideChevronDown"
					data-slot="native-select-icon"
					aria-hidden="true"
					class="spartan-native-select-icon pointer-events-none absolute select-none"
				/>
			</div>
		</section>
	`,
})
export default class NativeSelectDemo {
	protected readonly _status = signal('');
	protected readonly _statusLabel = computed(
		() => STATUSES.find((option) => option.value === this._status())?.label ?? 'Select status',
	);
	protected readonly _statusMenu = computed(() => menuFor(STATUSES, this._status()));
	protected readonly _priority = signal('medium');
	protected readonly _priorityLabel = computed(
		() => PRIORITIES.find((option) => option.value === this._priority())?.label ?? '',
	);
	protected readonly _priorityMenu = computed(() => menuFor(PRIORITIES, this._priority()));

	protected value(event: MenuSelectedEvent<MenuAction<string>>) {
		return event.data.option.value ?? '';
	}
}
