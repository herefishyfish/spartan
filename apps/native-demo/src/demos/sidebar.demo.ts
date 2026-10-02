import { Component, NO_ERRORS_SCHEMA, inject, signal, viewChild } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon, type IconName } from '../ui/icon';
import { Overlays } from '../ui/overlays';

interface NavItem {
	readonly title: string;
	readonly icon: IconName;
	readonly badge?: string;
}

const GROUPS: readonly { readonly label: string; readonly items: readonly NavItem[] }[] = [
	{
		label: 'Application',
		items: [
			{ title: 'Home', icon: 'lucideHouse' },
			{ title: 'Inbox', icon: 'lucideInbox', badge: '24' },
			{ title: 'Calendar', icon: 'lucideCalendar' },
			{ title: 'Search', icon: 'lucideSearch' },
		],
	},
	{
		label: 'Workspace',
		items: [
			{ title: 'Projects', icon: 'lucideFolder' },
			{ title: 'Settings', icon: 'lucideSettings' },
		],
	},
];

const MENU_BUTTON =
	'spartan-sidebar-menu-button spartan-sidebar-menu-button-variant-default spartan-sidebar-menu-button-size-default peer/menu-button group/menu-button flex w-full flex-row items-center overflow-hidden outline-hidden';

/** On mobile spartan's sidebar is an off-canvas sheet: here, the native drawer's left edge (swipe or trigger). */
@Component({
	selector: 'sidebar-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="sidebar-inset" class="spartan-sidebar-inset relative flex w-full flex-1 flex-col rounded-xl border">
			<div class="flex h-12 flex-row items-center gap-2 border-b px-4">
				<button data-sidebar="trigger" data-slot="sidebar-trigger" [class]="_trigger" (click)="open()">
					<ui-icon name="lucidePanelLeft" />
				</button>
				<div data-slot="separator" class="bg-border mr-2 h-4 w-px"></div>
				<span class="text-sm font-medium">{{ _active() }}</span>
			</div>
			<div class="flex flex-col gap-4 p-4">
				<div class="bg-muted/50 aspect-video w-full rounded-xl"></div>
				<div class="bg-muted/50 h-24 w-full rounded-xl"></div>
			</div>
		</div>
		<p class="text-muted-foreground text-sm">Tap the trigger to open it; swipe it away or tap outside to close it.</p>

		<ng-template #panel let-ref>
			<div
				data-slot="sidebar"
				data-sidebar="sidebar"
				data-mobile="true"
				class="bg-sidebar text-sidebar-foreground flex h-full w-full flex-col"
			>
				<div data-slot="sidebar-header" data-sidebar="header" class="spartan-sidebar-header flex flex-col">
					<div [class]="_menuButtonLg">
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 flex-row items-center justify-center rounded-lg"
						>
							<ui-icon name="lucideGalleryVerticalEnd" />
						</div>
						<div class="flex flex-1 flex-col">
							<span class="text-sm font-medium">spartan/ui</span>
							<span class="text-muted-foreground text-xs">v1.5.0</span>
						</div>
					</div>
				</div>
				<div data-slot="sidebar-content" data-sidebar="content" class="spartan-sidebar-content flex flex-1 flex-col">
					@for (group of _groups; track group.label) {
						<div
							data-slot="sidebar-group"
							data-sidebar="group"
							class="spartan-sidebar-group relative flex w-full flex-col"
						>
							<span
								data-slot="sidebar-group-label"
								data-sidebar="group-label"
								class="spartan-sidebar-group-label flex shrink-0 flex-row items-center outline-hidden"
							>
								{{ group.label }}
							</span>
							<div data-slot="sidebar-menu" data-sidebar="menu" class="spartan-sidebar-menu flex w-full flex-col">
								@for (item of group.items; track item.title) {
									<div data-slot="sidebar-menu-item" data-sidebar="menu-item" class="group/menu-item relative">
										<div
											data-slot="sidebar-menu-button"
											data-sidebar="menu-button"
											[class]="_menuButton"
											[attr.data-active]="_active() === item.title ? 'true' : null"
											(click)="select(item.title); ref.close()"
										>
											<ui-icon [name]="item.icon" />
											<span class="flex-1">{{ item.title }}</span>
											@if (item.badge) {
												<span data-slot="sidebar-menu-badge" class="spartan-sidebar-menu-badge text-xs">
													{{ item.badge }}
												</span>
											}
										</div>
									</div>
								}
							</div>
						</div>
					}
				</div>
				<div data-slot="sidebar-footer" data-sidebar="footer" class="spartan-sidebar-footer flex flex-col">
					<div [class]="_menuButtonLg">
						<div class="bg-muted flex size-8 flex-row items-center justify-center rounded-lg text-xs">PD</div>
						<div class="flex flex-1 flex-col">
							<span class="text-sm font-medium">Pedro Duarte</span>
							<span class="text-muted-foreground text-xs">pedro&#64;example.com</span>
						</div>
					</div>
				</div>
			</div>
		</ng-template>
	`,
})
export default class SidebarDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	protected readonly _groups = GROUPS;
	protected readonly _active = signal('Home');
	protected readonly _trigger = `${buttonVariants({ variant: 'ghost', size: 'icon-sm' })} -ml-1`;
	protected readonly _menuButton = `${MENU_BUTTON} data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium`;
	protected readonly _menuButtonLg = MENU_BUTTON.replace('size-default', 'size-lg');

	protected open() {
		this._overlays.open(this._panel(), { kind: 'sheet', side: 'left' });
	}

	protected select(title: string) {
		this._active.set(title);
	}
}
