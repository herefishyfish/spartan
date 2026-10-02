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
	viewChildren,
} from '@angular/core';
import type { View } from '@nativescript/core';
import { Icon } from '../ui/icon';
import { type OverlayRef, Overlays } from '../ui/overlays';

type MenuEntry =
	| { readonly kind: 'separator' }
	| { readonly kind: 'item'; readonly label: string; readonly shortcut?: string; readonly disabled?: boolean }
	| { readonly kind: 'checkbox'; readonly label: string; readonly checked: WritableSignal<boolean> }
	| { readonly kind: 'sub'; readonly label: string; readonly entries: readonly MenuEntry[] };

interface Menu {
	readonly label: string;
	readonly width: string;
	readonly entries: readonly MenuEntry[];
}

const ITEM =
	'relative flex w-full cursor-default flex-row items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50';

@Component({
	selector: 'menubar-demo',
	imports: [Icon, NgTemplateOutlet],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div class="flex flex-row">
			<div data-slot="menubar" role="menubar" class="spartan-menubar flex flex-row items-center">
				@for (menu of _menus; track menu.label; let index = $index) {
					<button
						#trigger
						role="menuitem"
						data-slot="menubar-trigger"
						class="spartan-menubar-trigger flex items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50"
						[attr.aria-expanded]="_openLabel() === menu.label"
						(click)="openMenu(menu, index)"
					>
						{{ menu.label }}
					</button>
				}
			</div>
		</div>
		<p class="text-muted-foreground text-sm">Last action: {{ _lastAction() }}</p>
		<p class="text-muted-foreground text-sm">
			Bookmarks bar {{ _bookmarks() ? 'shown' : 'hidden' }}, full URLs {{ _fullUrls() ? 'shown' : 'hidden' }}
		</p>

		<ng-template #panel let-ref>
			<div data-slot="dropdown-menu" data-state="open" data-side="bottom" [class]="_content + ' ' + _current().width">
				<ng-container *ngTemplateOutlet="entriesTemplate; context: { $implicit: _current().entries, ref }" />
			</div>
		</ng-template>

		<ng-template #entriesTemplate let-entries let-ref="ref">
			@for (entry of _asEntries(entries); track $index) {
				@switch (entry.kind) {
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
export default class MenubarDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _triggers = viewChildren('trigger', { read: ElementRef<View> });
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	private readonly _ref = signal<OverlayRef | null>(null);
	protected readonly _content =
		'spartan-dropdown-menu-content flex flex-col overflow-x-hidden overflow-y-auto outline-none';
	protected readonly _item = `spartan-dropdown-menu-item group/dropdown-menu-item ${ITEM}`;
	protected readonly _subTrigger = `${this._item} aria-expanded:bg-accent aria-expanded:text-accent-foreground`;
	protected readonly _checkboxItem = `spartan-dropdown-menu-checkbox-item group/dropdown-menu-checkbox ${ITEM}`;
	protected readonly _checkboxIndicator =
		'spartan-dropdown-menu-item-indicator pointer-events-none opacity-0 group-data-checked/dropdown-menu-checkbox:opacity-100';

	protected readonly _lastAction = signal('none');
	protected readonly _expanded = signal<string | null>(null);
	protected readonly _bookmarks = signal(false);
	protected readonly _fullUrls = signal(true);
	protected readonly _menus: readonly Menu[] = [
		{
			label: 'File',
			width: 'w-56',
			entries: [
				{ kind: 'item', label: 'New Tab', shortcut: '⌘T' },
				{ kind: 'item', label: 'New Window', shortcut: '⌘N' },
				{ kind: 'item', label: 'New Incognito Window', disabled: true },
				{ kind: 'separator' },
				{
					kind: 'sub',
					label: 'Share',
					entries: [
						{ kind: 'item', label: 'Email link' },
						{ kind: 'item', label: 'Messages' },
						{ kind: 'item', label: 'Notes' },
					],
				},
				{ kind: 'separator' },
				{ kind: 'item', label: 'Print', shortcut: '⌘P' },
			],
		},
		{
			label: 'Edit',
			width: 'w-48',
			entries: [
				{ kind: 'item', label: 'Undo', shortcut: '⌘Z' },
				{ kind: 'item', label: 'Redo', shortcut: '⇧⌘Z' },
				{ kind: 'separator' },
				{
					kind: 'sub',
					label: 'Find',
					entries: [
						{ kind: 'item', label: 'Search the web' },
						{ kind: 'separator' },
						{ kind: 'item', label: 'Find...' },
						{ kind: 'item', label: 'Find Next' },
						{ kind: 'item', label: 'Find Previous' },
					],
				},
				{ kind: 'separator' },
				{ kind: 'item', label: 'Cut' },
				{ kind: 'item', label: 'Copy' },
				{ kind: 'item', label: 'Paste' },
			],
		},
		{
			label: 'View',
			width: 'w-56',
			entries: [
				{ kind: 'checkbox', label: 'Bookmarks Bar', checked: this._bookmarks },
				{ kind: 'checkbox', label: 'Full URLs', checked: this._fullUrls },
				{ kind: 'separator' },
				{ kind: 'item', label: 'Reload', shortcut: '⌘R' },
				{ kind: 'item', label: 'Force Reload', shortcut: '⇧⌘R', disabled: true },
				{ kind: 'separator' },
				{ kind: 'item', label: 'Toggle Fullscreen' },
				{ kind: 'separator' },
				{ kind: 'item', label: 'Hide Sidebar' },
			],
		},
	];
	protected readonly _current = signal(this._menus[0]);
	protected readonly _openLabel = computed(() => (this._overlays.isOpen(this._ref()) ? this._current().label : null));

	protected readonly _asEntries = (entries: readonly MenuEntry[]) => entries;

	protected openMenu(menu: Menu, index: number) {
		this._current.set(menu);
		this._expanded.set(null);
		this._ref.set(
			this._overlays.open(this._panel(), {
				kind: 'anchored',
				anchor: this._triggers()[index].nativeElement,
				side: 'bottom',
				align: 'start',
				offset: 8,
			}),
		);
	}

	protected run(label: string, disabled: boolean | undefined, ref: OverlayRef) {
		if (disabled) return;
		this._lastAction.set(label);
		ref.close();
	}
}
