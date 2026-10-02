import { Component, ElementRef, NO_ERRORS_SCHEMA, computed, inject, signal, viewChild } from '@angular/core';
import type { View } from '@nativescript/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';
import { type OverlayRef, Overlays } from '../ui/overlays';

interface Framework {
	readonly label: string;
	readonly value: string;
}

const FRAMEWORKS: readonly Framework[] = [
	{ label: 'AnalogJs', value: 'analogjs' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'Vue', value: 'vue' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'React', value: 'react' },
	{ label: 'NextJs', value: 'nextjs' },
];

@Component({
	selector: 'combobox-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="combobox" class="block">
			<div
				#anchor
				role="group"
				data-slot="input-group"
				class="group/input-group spartan-input-group relative flex w-64 min-w-0 flex-row items-center outline-none"
			>
				<input
					role="combobox"
					data-slot="input-group-control"
					placeholder="Select a framework"
					class="spartan-input placeholder:text-muted-foreground spartan-input-group-input w-full min-w-0 flex-1 outline-none"
					[attr.aria-expanded]="_open()"
					[value]="_query()"
					(input)="search($any($event).target.value)"
				/>
				<div
					role="group"
					data-slot="input-group-addon"
					data-align="inline-end"
					class="spartan-input-group-addon spartan-input-group-addon-align-inline-end order-last flex cursor-text flex-row items-center justify-center select-none"
				>
					<button data-slot="input-group-button" data-size="icon-xs" [class]="_iconButton" (click)="openList()">
						<ui-icon name="lucideChevronDown" />
					</button>
				</div>
			</div>
		</div>
		<p class="text-muted-foreground text-sm">Value: {{ _value()?.value ?? 'none' }}</p>

		<ng-template #panel let-ref>
			<div
				data-slot="combobox-content"
				data-state="open"
				data-side="bottom"
				class="spartan-combobox-content group/combobox-content relative flex w-64 flex-col p-0"
				[attr.data-empty]="_matches().length ? null : ''"
			>
				<span data-slot="combobox-empty" class="spartan-combobox-empty">No items found.</span>
				<div
					role="listbox"
					data-slot="combobox-list"
					class="spartan-combobox-list flex flex-col overflow-y-auto overscroll-contain"
					[attr.data-empty]="_matches().length ? null : ''"
				>
					@for (framework of _frameworks; track framework.value) {
						<div
							role="option"
							data-slot="combobox-item"
							class="spartan-combobox-item relative flex w-full cursor-default flex-row items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-hidden:hidden"
							[attr.data-value]="framework.value"
							[attr.data-hidden]="_matches().includes(framework) ? null : ''"
							[attr.aria-selected]="framework === _value()"
							[attr.data-highlighted]="framework === _value() ? '' : null"
							(click)="select(framework, ref)"
						>
							<span>{{ framework.label }}</span>
							@if (framework === _value()) {
								<ui-icon name="lucideCheck" class="spartan-combobox-item-indicator" aria-hidden="true" />
							}
						</div>
					}
				</div>
			</div>
		</ng-template>
	`,
})
export default class ComboboxDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _anchor = viewChild.required('anchor', { read: ElementRef<View> });
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	private readonly _ref = signal<OverlayRef | null>(null);
	protected readonly _open = computed(() => this._overlays.isOpen(this._ref()));
	protected readonly _iconButton = `${buttonVariants({ variant: 'ghost' })} spartan-input-group-button flex items-center shadow-none spartan-input-group-button-size-icon-xs`;
	protected readonly _frameworks = FRAMEWORKS;
	protected readonly _value = signal<Framework | null>(null);
	protected readonly _query = signal('');
	protected readonly _matches = computed(() => {
		const query = this._query().trim().toLowerCase();
		if (!query || query === this._value()?.label.toLowerCase()) return FRAMEWORKS;
		return FRAMEWORKS.filter((framework) => framework.label.toLowerCase().includes(query));
	});

	protected search(text: string) {
		this._query.set(text);
		if (!this._open()) this.openList();
	}

	protected openList() {
		this._ref.set(
			this._overlays.open(this._panel(), {
				kind: 'anchored',
				anchor: this._anchor().nativeElement,
				side: 'bottom',
				align: 'start',
			}),
		);
	}

	protected select(framework: Framework, ref: OverlayRef) {
		this._value.set(framework);
		this._query.set(framework.label);
		ref.close();
	}
}
