import { Component, NO_ERRORS_SCHEMA, inject, signal, viewChild } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';
import { Overlays } from '../ui/overlays';

type Side = 'top' | 'right' | 'bottom' | 'left';

const FIELD = 'spartan-field group/field flex w-full spartan-field-orientation-vertical flex-col';
const LABEL =
	'spartan-label flex items-center select-none spartan-field-label group/field-label peer/field-label flex w-fit';

@Component({
	selector: 'sheet-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div class="flex flex-row flex-wrap gap-2">
			@for (_side of _sides; track _side) {
				<button data-slot="sheet-trigger" [class]="_outline" (click)="open(_side)">{{ _side }}</button>
			}
		</div>
		<p class="text-muted-foreground text-sm">Saved: {{ _name() }} ({{ _username() }})</p>

		<ng-template #panel let-ref>
			<div
				data-slot="sheet-content"
				data-state="open"
				[attr.data-side]="_side()"
				class="spartan-sheet-content"
				style="position: relative"
			>
				<div data-slot="sheet-header" class="spartan-sheet-header flex flex-col">
					<h3 data-slot="sheet-title" class="spartan-sheet-title">Edit Profile</h3>
					<p data-slot="sheet-description" class="spartan-sheet-description">
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
				<div data-slot="sheet-footer" class="spartan-sheet-footer mt-auto flex flex-col">
					<button [class]="_primary" (click)="save(); ref.close()">Save Changes</button>
					<button data-slot="sheet-close" [class]="_outline" (click)="ref.close()">Close</button>
				</div>
				<button data-slot="sheet-close" [class]="_close" (click)="ref.close()">
					<ui-icon name="lucideX" />
				</button>
			</div>
		</ng-template>
	`,
})
export default class SheetDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	protected readonly _sides: readonly Side[] = ['top', 'right', 'bottom', 'left'];
	protected readonly _side = signal<Side>('right');
	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _primary = buttonVariants();
	protected readonly _close = `${buttonVariants({ variant: 'ghost', size: 'icon-sm' })} spartan-sheet-close`;
	protected readonly _fieldClass = FIELD;
	protected readonly _label = LABEL;
	protected readonly _name = signal('Pedro Duarte');
	protected readonly _username = signal('@peduarte');
	protected readonly _fields = [
		{ label: 'Name', value: this._name, draft: signal(this._name()) },
		{ label: 'Username', value: this._username, draft: signal(this._username()) },
	];

	protected open(side: Side) {
		this._side.set(side);
		for (const field of this._fields) field.draft.set(field.value());
		this._overlays.open(this._panel(), { kind: 'sheet', side });
	}

	protected save() {
		for (const field of this._fields) field.value.set(field.draft());
	}
}
