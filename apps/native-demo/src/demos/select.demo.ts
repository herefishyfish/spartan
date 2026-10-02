import { Component, ElementRef, NO_ERRORS_SCHEMA, computed, inject, signal, viewChild } from '@angular/core';
import type { View } from '@nativescript/core';
import { Icon } from '../ui/icon';
import { type OverlayRef, Overlays } from '../ui/overlays';

interface Option {
	readonly label: string;
	readonly value: string;
}

@Component({
	selector: 'select-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="select" class="block">
			<div
				#trigger
				role="combobox"
				data-slot="select-trigger"
				data-size="default"
				class="spartan-select-trigger flex w-56 flex-row items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50"
				[attr.data-placeholder]="_selected() ? null : ''"
				[attr.aria-expanded]="_open()"
				(click)="openList()"
			>
				<span data-slot="select-value" class="line-clamp-1 flex items-center">
					{{ _selected()?.label ?? 'Select a fruit' }}
				</span>
				<ui-icon name="lucideChevronDown" class="spartan-select-trigger-icon ms-auto" />
			</div>
		</div>
		<p class="text-muted-foreground text-sm">Value: {{ _selected()?.value ?? 'none' }}</p>

		<ng-template #panel let-ref>
			<div
				data-state="open"
				data-side="bottom"
				class="spartan-select-content relative flex w-56 flex-col overflow-x-hidden overflow-y-auto"
			>
				<div role="listbox" class="flex flex-col">
					@for (group of _groups; track group.label; let last = $last) {
						<div role="group" data-slot="select-group" class="spartan-select-group flex flex-col">
							<div data-slot="select-label" class="spartan-select-label flex">{{ group.label }}</div>
							@for (option of group.options; track option.value) {
								<div
									role="option"
									data-slot="select-item"
									class="spartan-select-item relative flex w-full cursor-default flex-row items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50"
									[attr.data-value]="option.value"
									[attr.aria-selected]="option === _selected()"
									[attr.data-highlighted]="option === _selected() ? '' : null"
									(click)="select(option, ref)"
								>
									<span>{{ option.label }}</span>
									@if (option === _selected()) {
										<ui-icon name="lucideCheck" class="spartan-select-item-indicator" aria-hidden="true" />
									}
								</div>
							}
						</div>
						@if (!last) {
							<div
								data-slot="select-separator"
								data-orientation="horizontal"
								class="spartan-select-separator pointer-events-none"
							></div>
						}
					}
				</div>
			</div>
		</ng-template>
	`,
})
export default class SelectDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _trigger = viewChild.required('trigger', { read: ElementRef<View> });
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	private readonly _ref = signal<OverlayRef | null>(null);
	protected readonly _open = computed(() => this._overlays.isOpen(this._ref()));
	protected readonly _selected = signal<Option | null>(null);
	protected readonly _groups: readonly { readonly label: string; readonly options: readonly Option[] }[] = [
		{
			label: 'Fruits',
			options: [
				{ label: 'Apple', value: 'apple' },
				{ label: 'Banana', value: 'banana' },
				{ label: 'Blueberry', value: 'blueberry' },
				{ label: 'Grapes', value: 'grapes' },
				{ label: 'Pineapple', value: 'pineapple' },
			],
		},
		{
			label: 'Vegetables',
			options: [
				{ label: 'Carrot', value: 'carrot' },
				{ label: 'Broccoli', value: 'broccoli' },
				{ label: 'Spinach', value: 'spinach' },
			],
		},
	];

	protected openList() {
		this._ref.set(
			this._overlays.open(this._panel(), {
				kind: 'anchored',
				anchor: this._trigger().nativeElement,
				side: 'bottom',
				align: 'start',
			}),
		);
	}

	protected select(option: Option, ref: OverlayRef) {
		this._selected.set(option);
		ref.close();
	}
}
