import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import type { MenuAction, MenuSelectedEvent } from '@nstudio/nativescript-menu';
import { nativeMenu } from '../ui/menu';

type Action = 'toggle-bookmarks' | 'toggle-full-urls' | 'person' | 'run';

/** The spartan context menu's entries as a native long-press menu (UIMenu / Android anchored menu). */
@Component({
	selector: 'context-menu-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div
			data-slot="context-menu-trigger"
			class="flex aspect-video w-full flex-row items-center justify-center rounded-xl border border-dashed text-sm select-none"
			[contextMenu]="_options()"
			(selected)="select($any($event))"
		>
			<span>Long press here</span>
		</div>
		<p class="text-muted-foreground text-sm">Last action: {{ _lastAction() }}</p>
		<p class="text-muted-foreground text-sm">
			Bookmarks bar {{ _bookmarks() ? 'shown' : 'hidden' }}, full URLs {{ _fullUrls() ? 'shown' : 'hidden' }}, person
			{{ _person() }}
		</p>
	`,
})
export default class ContextMenuDemo {
	protected readonly _lastAction = signal('none');
	protected readonly _bookmarks = signal(true);
	protected readonly _fullUrls = signal(false);
	protected readonly _person = signal('Pedro Duarte');
	protected readonly _options = computed(() =>
		nativeMenu<Action>([
			{ name: 'Back', subtitle: '⌘[', value: 'run' },
			{ name: 'Forward', subtitle: '⌘]', value: 'run', disabled: true },
			{ name: 'Reload', subtitle: '⌘R', value: 'run' },
			{
				name: 'More Tools',
				children: [
					{ name: 'Save Page...', value: 'run' },
					{ name: 'Create Shortcut...', value: 'run' },
					{ name: 'Name Window...', value: 'run' },
					{ name: 'Developer Tools', value: 'run' },
					{ name: 'Delete', value: 'run', destructive: true },
				],
			},
			{
				name: '',
				childrenStyle: 'inline',
				children: [
					{
						name: 'Show Bookmarks Bar',
						value: 'toggle-bookmarks',
						keepsMenuOpen: true,
						state: this._bookmarks() ? 'on' : 'off',
					},
					{
						name: 'Show full URLs',
						value: 'toggle-full-urls',
						keepsMenuOpen: true,
						state: this._fullUrls() ? 'on' : 'off',
					},
				],
			},
			{
				name: 'People',
				childrenStyle: 'inline',
				singleSelection: true,
				children: ['Pedro Duarte', 'Colm Tuite'].map((name) => ({
					name,
					value: 'person' as const,
					state: this._person() === name ? ('on' as const) : ('off' as const),
				})),
			},
		]),
	);

	protected select(event: MenuSelectedEvent<MenuAction<Action>>) {
		const { name = '', value } = event.data.option;
		switch (value) {
			case 'toggle-bookmarks':
				return this._bookmarks.update((shown) => !shown);
			case 'toggle-full-urls':
				return this._fullUrls.update((shown) => !shown);
			case 'person':
				return this._person.set(name);
			default:
				return this._lastAction.set(name);
		}
	}
}
