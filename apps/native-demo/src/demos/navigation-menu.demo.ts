import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { Icon, type IconName } from '../ui/icon';

interface NavLink {
	readonly title: string;
	readonly description?: string;
	readonly icon?: IconName;
}

interface NavSection {
	readonly label: string;
	readonly links: readonly NavLink[];
}

const LINK = 'spartan-navigation-menu-link flex-row';

@Component({
	selector: 'navigation-menu-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<nav
			data-slot="navigation-menu"
			data-orientation="horizontal"
			class="spartan-navigation-menu group/navigation-menu relative flex max-w-max flex-1 flex-col items-start"
		>
			<div
				role="list"
				data-slot="navigation-menu-list"
				data-orientation="horizontal"
				class="spartan-navigation-menu-list group flex flex-1 list-none flex-row flex-wrap items-center justify-center"
			>
				@for (section of _sections; track section.label) {
					<div
						role="listitem"
						data-slot="navigation-menu-item"
						class="relative data-active:z-10"
						[attr.data-active]="_open() === section.label ? 'true' : null"
					>
						<button
							data-slot="navigation-menu-trigger"
							class="spartan-navigation-menu-trigger group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center outline-none disabled:pointer-events-none"
							[attr.data-state]="_open() === section.label ? 'open' : 'closed'"
							[attr.aria-expanded]="_open() === section.label"
							(click)="_open.set(_open() === section.label ? null : section.label)"
						>
							<span>{{ section.label }}</span>
							<ui-icon name="lucideChevronDown" class="spartan-navigation-menu-trigger-icon" />
						</button>
					</div>
				}
				<div role="listitem" data-slot="navigation-menu-item" class="relative data-active:z-10">
					<a
						data-slot="navigation-menu-link"
						[class]="_link"
						[attr.data-active]="_visited() === 'Docs' ? true : null"
						(click)="visit('Docs')"
					>
						Docs
					</a>
				</div>
			</div>
			@if (_section(); as section) {
				<div
					data-slot="navigation-menu-content"
					data-state="open"
					data-orientation="horizontal"
					class="spartan-navigation-menu-popup top-0 left-0 mt-1.5 block w-full p-2 pr-2.5"
				>
					<div role="list" class="flex flex-col gap-1">
						@for (entry of section.links; track entry.title) {
							<div
								role="link"
								data-slot="navigation-menu-link"
								[class]="_link"
								[attr.data-active]="_visited() === entry.title ? true : null"
								(click)="visit(entry.title)"
							>
								@if (entry.icon) {
									<ui-icon [name]="entry.icon" />
									<span>{{ entry.title }}</span>
								} @else {
									<div class="flex flex-col gap-1 text-sm">
										<span class="leading-none font-medium">{{ entry.title }}</span>
										<span class="text-muted-foreground line-clamp-2">{{ entry.description }}</span>
									</div>
								}
							</div>
						}
					</div>
				</div>
			}
		</nav>
		<p class="text-muted-foreground text-sm">Visited: {{ _visited() }}</p>
	`,
})
export default class NavigationMenuDemo {
	protected readonly _link = LINK;
	protected readonly _sections: readonly NavSection[] = [
		{
			label: 'Getting started',
			links: [
				{ title: 'Introduction', description: 'Re-usable components built with Tailwind CSS.' },
				{ title: 'Installation', description: 'How to install dependencies and structure your app.' },
				{ title: 'Typography', description: 'Styles for headings, paragraphs, lists...etc' },
			],
		},
		{
			label: 'Components',
			links: [
				{
					title: 'Alert Dialog',
					description: 'A modal dialog that interrupts the user with important content and expects a response.',
				},
				{ title: 'Hover Card', description: 'For sighted users to preview content available behind a link.' },
				{ title: 'Progress', description: 'Displays an indicator showing the completion progress of a task.' },
				{ title: 'Tabs', description: 'A set of layered content panels displayed one at a time.' },
			],
		},
		{
			label: 'With Icon',
			links: [
				{ title: 'Backlog', icon: 'lucideInfo' },
				{ title: 'To Do', icon: 'lucideCircle' },
				{ title: 'Done', icon: 'lucideCheck' },
			],
		},
	];
	protected readonly _open = signal<string | null>(null);
	protected readonly _section = computed(() => this._sections.find((section) => section.label === this._open()));
	protected readonly _visited = signal('none');

	protected visit(title: string) {
		this._visited.set(title);
		this._open.set(null);
	}
}
