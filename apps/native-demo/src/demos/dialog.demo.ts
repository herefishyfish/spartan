import { Component, NO_ERRORS_SCHEMA, inject, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';
import { Overlays } from '../ui/overlays';

@Component({
	selector: 'dialog-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<button data-slot="dialog-trigger" [class]="_outline" (click)="_overlays.open(profile, { kind: 'modal' })">
			Edit profile
		</button>
		<p class="text-muted-foreground text-sm">Saved name: {{ _name() }}</p>

		<ng-template #profile let-ref>
			<div
				data-slot="dialog-content"
				data-state="open"
				class="spartan-dialog-content relative mx-auto flex w-full flex-col"
			>
				<div data-slot="dialog-header" class="spartan-dialog-header flex flex-col">
					<h2 data-slot="dialog-title" class="spartan-dialog-title">Edit profile</h2>
					<p data-slot="dialog-description" class="spartan-dialog-description">
						Make changes to your profile here. Click save when you're done.
					</p>
				</div>
				<div class="flex flex-col gap-3">
					<span class="text-sm font-medium">Name</span>
					<input
						class="spartan-input"
						data-slot="input"
						[value]="_draft()"
						(input)="_draft.set($any($event).target.value)"
					/>
				</div>
				<div data-slot="dialog-footer" class="spartan-dialog-footer flex flex-col-reverse gap-2">
					<button [class]="_outline" (click)="ref.close()">Cancel</button>
					<button [class]="_primary" (click)="_name.set(_draft()); ref.close()">Save changes</button>
				</div>
				<button data-slot="dialog-close" class="spartan-dialog-close absolute" (click)="ref.close()">
					<ui-icon name="lucideX" />
				</button>
			</div>
		</ng-template>
	`,
})
export default class DialogDemo {
	protected readonly _overlays = inject(Overlays);
	protected readonly _name = signal('Pedro Duarte');
	protected readonly _draft = signal('Pedro Duarte');
	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _primary = buttonVariants();
}
