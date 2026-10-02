import { NgTemplateOutlet } from '@angular/common';
import {
	Component,
	ElementRef,
	NO_ERRORS_SCHEMA,
	type WritableSignal,
	computed,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import type { View } from '@nativescript/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';
import { type OverlayRef, Overlays } from '../ui/overlays';

type MenuEntry =
	| { readonly kind: 'label'; readonly label: string }
	| { readonly kind: 'separator' }
	| { readonly kind: 'item'; readonly label: string; readonly shortcut?: string; readonly disabled?: boolean }
	| { readonly kind: 'checkbox'; readonly label: string; readonly checked: WritableSignal<boolean> }
	| { readonly kind: 'radio'; readonly label: string; readonly group: WritableSignal<string> }
	| { readonly kind: 'sub'; readonly label: string; readonly entries: readonly MenuEntry[] };

const ITEM =
	'relative flex w-full cursor-default flex-row items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50';

@Component({
	selector: 'dropdown-menu-demo',
	imports: [Icon, NgTemplateOutlet],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div class="flex flex-row">
			<button
				#trigger
				data-slot="dropdown-menu-trigger"
				[class]="_outline"
				[attr.aria-expanded]="_open()"
				(click)="openMenu()"
			>
				Open
			</button>
		</div>
		<p class="text-muted-foreground text-sm">Last action: {{ _lastAction() }}</p>
		<p class="text-muted-foreground text-sm">
			Status bar {{ _statusBar() ? 'shown' : 'hidden' }}, panel {{ _position() }}
		</p>

		<ng-template #panel let-ref>
			<div
				data-slot="dropdown-menu"
				data-state="open"
				data-side="bottom"
				class="spartan-dropdown-menu-content flex w-56 flex-col overflow-x-hidden overflow-y-auto outline-none"
			>
				<ng-container *ngTemplateOutlet="entriesTemplate; context: { $implicit: _entries, ref }" />
			</div>
		</ng-template>

		<ng-template #entriesTemplate let-entries let-ref="ref">
			@for (entry of _asEntries(_entries); track $index) {
				@switch (entry.kind) {
					@case ('label') {
						<span data-slot="dropdown-menu-label" class="spartan-dropdown-menu-label block">{{ entry.label }}</span>
					}
					@case ('separator') {
						<div data-slot="dropdown-menu-separator" class="spartan-dropdown-menu-separator block"></div>
					}
					@case ('item') {
						<div
							role="menuitem"
							data-slot="dropdown-menu-item"
							data-variant="default"
							[class]="_item"
							[attr.data-disabled]="entry.disabled ? '' : null"
							(click)="run(entry.label, entry.disabled, ref)"
						>
							<span>{{ entry.label }}</span>
							@if (entry.shortcut) {
								<span data-slot="dropdown-menu-shortcut" class="spartan-dropdown-menu-shortcut">
									{{ entry.shortcut }}
								</span>
							}
						</div>
					}
					@case ('checkbox') {
						<div
							role="menuitemcheckbox"
							data-slot="dropdown-menu-checkbox-item"
							[class]="_checkboxItem"
							[attr.data-checked]="entry.checked() ? '' : null"
							(click)="entry.checked.set(!entry.checked())"
						>
							<span>{{ entry.label }}</span>
							<div data-slot="dropdown-menu-checkbox-item-indicator" [class]="_checkboxIndicator">
								<ui-icon name="lucideCheck" />
							</div>
						</div>
					}
					@case ('radio') {
						<div
							role="menuitemradio"
							data-slot="dropdown-menu-radio-item"
							[class]="_radioItem"
							[attr.data-checked]="entry.group() === entry.label ? '' : null"
							(click)="entry.group.set(entry.label)"
						>
							<span>{{ entry.label }}</span>
							<div data-slot="dropdown-menu-radio-item-indicator" [class]="_radioIndicator">
								<ui-icon name="lucideCheck" />
							</div>
						</div>
					}
					@case ('sub') {
						<div
							role="menuitem"
							data-slot="dropdown-menu-sub-trigger"
							[class]="_subTrigger"
							[attr.aria-expanded]="_expanded() === entry.label"
							(click)="_expanded.set(_expanded() === entry.label ? null : entry.label)"
						>
							<span>{{ entry.label }}</span>
							<ui-icon
								class="ms-auto flex items-center justify-center"
								[name]="_expanded() === entry.label ? 'lucideChevronDown' : 'lucideChevronRight'"
							/>
						</div>
						@if (_expanded() === entry.label) {
							<div
								data-slot="dropdown-menu-sub"
								data-state="open"
								data-side="bottom"
								class="spartan-dropdown-menu-sub-content flex w-auto flex-col"
							>
								<ng-container *ngTemplateOutlet="entriesTemplate; context: { $implicit: entry.entries, ref }" />
							</div>
						}
					}
				}
			}
		</ng-template>
	`,
})
export default class DropdownMenuDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _trigger = viewChild.required('trigger', { read: ElementRef<View> });
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	private readonly _ref = signal<OverlayRef | null>(null);
	protected readonly _open = computed(() => this._overlays.isOpen(this._ref()));
	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _item = `spartan-dropdown-menu-item group/dropdown-menu-item ${ITEM}`;
	protected readonly _subTrigger = `${this._item} aria-expanded:bg-accent aria-expanded:text-accent-foreground`;
	protected readonly _checkboxItem = `spartan-dropdown-menu-checkbox-item group/dropdown-menu-checkbox ${ITEM}`;
	protected readonly _radioItem = `spartan-dropdown-menu-radio-item group/dropdown-menu-radio ${ITEM}`;
	protected readonly _checkboxIndicator =
		'spartan-dropdown-menu-item-indicator pointer-events-none opacity-0 group-data-checked/dropdown-menu-checkbox:opacity-100';
	protected readonly _radioIndicator =
		'spartan-dropdown-menu-item-indicator pointer-events-none opacity-0 group-data-checked/dropdown-menu-radio:opacity-100';

	protected readonly _lastAction = signal('none');
	protected readonly _expanded = signal<string | null>(null);
	protected readonly _statusBar = signal(true);
	protected readonly _position = signal('Bottom');
	protected readonly _entries: readonly MenuEntry[] = [
		{ kind: 'label', label: 'My Account' },
		{ kind: 'item', label: 'Profile', shortcut: '⇧⌘P' },
		{ kind: 'item', label: 'Billing', shortcut: '⌘B' },
		{ kind: 'item', label: 'Settings', shortcut: '⌘S' },
		{ kind: 'separator' },
		{
			kind: 'sub',
			label: 'Invite Users',
			entries: [
				{ kind: 'item', label: 'Email' },
				{ kind: 'item', label: 'Message' },
				{ kind: 'separator' },
				{ kind: 'item', label: 'More...' },
			],
		},
		{ kind: 'separator' },
		{ kind: 'checkbox', label: 'Status Bar', checked: this._statusBar },
		{ kind: 'separator' },
		{ kind: 'label', label: 'Panel Position' },
		{ kind: 'radio', label: 'Top', group: this._position },
		{ kind: 'radio', label: 'Bottom', group: this._position },
		{ kind: 'separator' },
		{ kind: 'item', label: 'API', disabled: true },
		{ kind: 'item', label: 'Log out', shortcut: '⇧⌘Q' },
	];

	protected readonly _asEntries = (entries: readonly MenuEntry[]) => entries;

	protected openMenu() {
		this._expanded.set(null);
		this._ref.set(
			this._overlays.open(this._panel(), {
				kind: 'anchored',
				anchor: this._trigger().nativeElement,
				side: 'bottom',
				align: 'start',
			}),
		);
	}

	protected run(label: string, disabled: boolean | undefined, ref: OverlayRef) {
		if (disabled) return;
		this._lastAction.set(label);
		ref.close();
	}
}
