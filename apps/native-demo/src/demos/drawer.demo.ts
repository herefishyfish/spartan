import { Component, NO_ERRORS_SCHEMA, inject, signal, viewChild } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Overlays } from '../ui/overlays';

const FIELD = 'spartan-field group/field flex w-full spartan-field-orientation-vertical flex-col';
const LABEL =
	'spartan-label flex items-center select-none spartan-field-label group/field-label peer/field-label flex w-fit';

@Component({
	selector: 'drawer-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div class="flex flex-row">
			<button data-slot="drawer-trigger" [class]="_outline" (click)="open()">Open Drawer</button>
		</div>
		<p class="text-muted-foreground text-sm">Saved: {{ _name() }} ({{ _username() }})</p>
		<p class="text-muted-foreground text-sm">A native bottom sheet: drag it down or tap outside to close it.</p>

		<ng-template #panel let-ref>
			<div
				data-slot="drawer-content"
				data-state="open"
				data-vaul-drawer-direction="bottom"
				class="spartan-drawer-content group/drawer-content"
				style="position: relative"
			>
				<div class="spartan-drawer-handle"></div>
				<div data-slot="drawer-header" class="spartan-drawer-header flex flex-col">
					<h3 data-slot="drawer-title" class="spartan-drawer-title">Edit Profile</h3>
					<p data-slot="drawer-description" class="spartan-drawer-description">
						Make changes to your profile here. Click save when you're done.
					</p>
				</div>
				<div data-slot="field-group" class="spartan-field-group group/field-group flex w-full flex-col px-4">
					@for (field of _fields; track field.label) {
						<div role="group" data-slot="field" data-orientation="vertical" [class]="_fieldClass">
							<label data-slot="field-label" [class]="_label">{{ field.label }}</label>
							<input
								data-slot="input"
								class="spartan-input w-full min-w-0 outline-none"
								[value]="field.draft()"
								(input)="field.draft.set($any($event).target.value)"
							/>
						</div>
					}
				</div>
				<div data-slot="drawer-footer" class="spartan-drawer-footer mt-auto flex flex-col">
					<button [class]="_primary" (click)="save(); ref.close()">Save Changes</button>
					<button data-slot="drawer-close" [class]="_outline" (click)="ref.close()">Cancel</button>
				</div>
			</div>
		</ng-template>
	`,
})
export default class DrawerDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _primary = buttonVariants();
	protected readonly _fieldClass = FIELD;
	protected readonly _label = LABEL;
	protected readonly _name = signal('Pedro Duarte');
	protected readonly _username = signal('peduarte');
	protected readonly _fields = [
		{ label: 'Name', value: this._name, draft: signal(this._name()) },
		{ label: 'Username', value: this._username, draft: signal(this._username()) },
	];

	protected open() {
		for (const field of this._fields) field.draft.set(field.value());
		this._overlays.open(this._panel(), { kind: 'drawer' });
	}

	protected save() {
		for (const field of this._fields) field.value.set(field.draft());
	}
}
