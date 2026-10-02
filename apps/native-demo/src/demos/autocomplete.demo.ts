import { Component, ElementRef, NO_ERRORS_SCHEMA, computed, inject, signal, viewChild } from '@angular/core';
import type { View } from '@nativescript/core';
import { Icon } from '../ui/icon';
import { type OverlayRef, Overlays } from '../ui/overlays';

const COMPONENTS = [
	'Accordion',
	'Alert dialog',
	'Autocomplete',
	'Avatar',
	'Checkbox',
	'Collapsible',
	'Combobox',
	'Command',
	'Context menu',
	'Data table',
	'Date picker',
	'Dialog',
	'Field',
	'Input',
	'Menubar',
	'Navigation menu',
	'Popover',
	'Progress',
	'Radio',
	'Scroll area',
	'Select',
	'Separator',
	'Skeleton',
	'Slider',
	'Sonner',
	'Spinner',
	'Switch',
	'Table',
	'Tabs',
	'Textarea',
	'Toggle',
	'Toggle group',
	'Tooltip',
];

@Component({
	selector: 'autocomplete-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="autocomplete" class="block">
			<div
				#anchor
				role="group"
				data-slot="input-group"
				class="group/input-group spartan-input-group relative flex w-64 min-w-0 flex-row items-center outline-none"
			>
				<input
					role="combobox"
					data-slot="input-group-control"
					placeholder="Search components"
					class="spartan-input placeholder:text-muted-foreground spartan-input-group-input w-full min-w-0 flex-1 outline-none"
					[attr.aria-expanded]="_open()"
					[value]="_search()"
					(input)="type($any($event).target.value)"
				/>
				<div
					role="group"
					data-slot="input-group-addon"
					data-align="inline-start"
					class="spartan-input-group-addon spartan-input-group-addon-align-inline-start order-first flex cursor-text flex-row items-center justify-center select-none"
				>
					<ui-icon name="lucideSearch" />
				</div>
			</div>
		</div>
		<p class="text-muted-foreground text-sm">Value: {{ _value() ?? 'none' }}</p>

		<ng-template #panel let-ref>
			<div
				data-state="open"
				data-side="bottom"
				class="group/autocomplete-content spartan-autocomplete-content flex w-64 flex-col p-0"
				[attr.data-empty]="_options().length ? null : ''"
			>
				<span data-slot="autocomplete-empty" class="spartan-autocomplete-empty">No components found.</span>
				<div
					role="listbox"
					data-slot="autocomplete-list"
					class="spartan-autocomplete-list flex flex-col overflow-y-auto overscroll-contain"
					[attr.data-empty]="_options().length ? null : ''"
				>
					@for (option of _options(); track option) {
						<div
							role="option"
							data-slot="autocomplete-item"
							class="spartan-autocomplete-item relative flex w-full cursor-default flex-row items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-hidden:hidden"
							[attr.data-value]="option"
							[attr.aria-selected]="option === _value()"
							[attr.data-highlighted]="option === _value() ? '' : null"
							(click)="select(option, ref)"
						>
							<span>{{ option }}</span>
							@if (option === _value()) {
								<ui-icon name="lucideCheck" class="spartan-autocomplete-item-indicator" aria-hidden="true" />
							}
						</div>
					}
				</div>
			</div>
		</ng-template>
	`,
})
export default class AutocompleteDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _anchor = viewChild.required('anchor', { read: ElementRef<View> });
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	private readonly _ref = signal<OverlayRef | null>(null);
	protected readonly _open = computed(() => this._overlays.isOpen(this._ref()));
	protected readonly _search = signal('');
	protected readonly _value = signal<string | null>(null);
	protected readonly _options = computed(() =>
		COMPONENTS.filter((component) => component.toLowerCase().includes(this._search().toLowerCase())),
	);

	protected type(text: string) {
		this._search.set(text);
		if (!this._open()) {
			this._ref.set(
				this._overlays.open(this._panel(), {
					kind: 'anchored',
					anchor: this._anchor().nativeElement,
					side: 'bottom',
					align: 'start',
				}),
			);
		}
	}

	protected select(option: string, ref: OverlayRef) {
		this._value.set(option);
		this._search.set(option);
		ref.close();
	}
}
