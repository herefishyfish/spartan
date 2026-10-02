import { Component, NO_ERRORS_SCHEMA, computed, inject, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon, type IconName } from '../ui/icon';
import { type OverlayRef, Overlays } from '../ui/overlays';

interface Command {
	readonly label: string;
	readonly icon: IconName;
	readonly shortcut?: string;
	readonly disabled?: boolean;
}

interface CommandGroup {
	readonly label: string;
	readonly commands: readonly Command[];
}

const GROUPS: readonly CommandGroup[] = [
	{
		label: 'Suggestions',
		commands: [
			{ label: 'Calendar', icon: 'lucideCalendar' },
			{ label: 'Search Emoji', icon: 'lucideSmile' },
			{ label: 'Calculator', icon: 'lucideCalculator', disabled: true },
		],
	},
	{
		label: 'Settings',
		commands: [
			{ label: 'Profile', icon: 'lucideUser', shortcut: '⌘P' },
			{ label: 'Billing', icon: 'lucideWallet', shortcut: '⌘B' },
			{ label: 'Settings', icon: 'lucideCog', shortcut: '⌘S' },
		],
	},
];

@Component({
	selector: 'command-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div class="flex flex-row">
			<button [class]="_outline" (click)="openPalette(palette)">Open Menu</button>
		</div>
		<p class="text-muted-foreground text-sm">Selected: {{ _selected() }}</p>

		<ng-template #palette let-ref>
			<div
				data-slot="dialog-content"
				data-state="open"
				class="spartan-dialog-content relative mx-auto flex w-full flex-col p-0"
			>
				<div data-slot="command" class="spartan-command flex size-full flex-col overflow-hidden">
					<div data-slot="command-input-wrapper" class="spartan-command-input-wrapper">
						<div
							role="group"
							data-slot="input-group"
							class="group/input-group spartan-input-group spartan-command-input-group relative flex w-full min-w-0 flex-row items-center outline-none"
						>
							<input
								data-slot="command-input"
								placeholder="Type a command or search..."
								class="spartan-command-input flex-1 outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
								[value]="_query()"
								(input)="_query.set($any($event).target.value)"
							/>
							<div
								role="group"
								data-slot="input-group-addon"
								data-align="inline-start"
								class="spartan-input-group-addon spartan-input-group-addon-align-inline-start order-first flex cursor-text flex-row items-center justify-center select-none"
							>
								<ui-icon name="lucideSearch" class="spartan-command-input-icon" />
							</div>
						</div>
					</div>
					<div
						role="listbox"
						data-slot="command-list"
						class="spartan-command-list flex flex-col overflow-x-hidden overflow-y-auto"
					>
						@if (!_visible().length) {
							<span data-slot="command-empty" class="spartan-command-empty">No results found.</span>
						}
						@for (group of _groups; track group.label; let last = $last) {
							<div
								role="group"
								data-slot="command-group"
								class="spartan-command-group block data-hidden:hidden"
								[attr.data-hidden]="hasVisible(group) ? null : true"
							>
								<span data-slot="command-group-label" class="inline-block">{{ group.label }}</span>
								@for (command of group.commands; track command.label) {
									<div
										role="option"
										data-slot="command-item"
										class="spartan-command-item group/command-item w-full flex-row data-disabled:pointer-events-none data-disabled:opacity-50 data-hidden:hidden"
										[attr.data-value]="command.label"
										[attr.data-disabled]="command.disabled ? '' : null"
										[attr.data-hidden]="_visible().includes(command) ? null : true"
										[attr.data-selected]="command === _active() ? true : null"
										[attr.aria-selected]="command === _active()"
										(click)="run(command, ref)"
									>
										<ui-icon [name]="command.icon" />
										<span>{{ command.label }}</span>
										@if (command.shortcut) {
											<span data-slot="command-shortcut" class="spartan-command-shortcut">{{ command.shortcut }}</span>
										}
									</div>
								}
							</div>
							@if (!last) {
								<div
									data-slot="command-separator"
									class="spartan-command-separator block data-hidden:hidden"
									[attr.data-hidden]="_query() ? true : null"
								></div>
							}
						}
					</div>
				</div>
			</div>
		</ng-template>
	`,
})
export default class CommandDemo {
	private readonly _overlays = inject(Overlays);
	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _groups = GROUPS;
	protected readonly _query = signal('');
	protected readonly _selected = signal('none');
	protected readonly _visible = computed(() => {
		const query = this._query().trim().toLowerCase();
		return GROUPS.flatMap((group) => group.commands).filter((command) => command.label.toLowerCase().includes(query));
	});
	protected readonly _active = computed(() => this._visible().find((command) => !command.disabled));

	protected hasVisible(group: CommandGroup) {
		return group.commands.some((command) => this._visible().includes(command));
	}

	protected openPalette(palette: Parameters<Overlays['open']>[0]) {
		this._query.set('');
		this._overlays.open(palette, { kind: 'modal' });
	}

	protected run(command: Command, ref: OverlayRef) {
		if (command.disabled) return;
		this._selected.set(command.label);
		ref.close();
	}
}
