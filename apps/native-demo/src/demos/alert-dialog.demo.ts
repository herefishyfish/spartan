import { Component, NO_ERRORS_SCHEMA, inject, signal, viewChild } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Overlays } from '../ui/overlays';

@Component({
	selector: 'alert-dialog-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div class="flex flex-row flex-wrap gap-2">
			<button data-slot="alert-dialog-trigger" [class]="_outline" (click)="open('default')">Show Dialog</button>
			<button data-slot="alert-dialog-trigger" [class]="_outline" (click)="open('sm')">Show Small Dialog</button>
		</div>
		<p class="text-muted-foreground text-sm">Result: {{ _result() }}</p>

		<ng-template #panel let-ref>
			<div
				data-slot="alert-dialog-content"
				data-state="open"
				[attr.data-size]="_size()"
				class="spartan-alert-dialog-content group/alert-dialog-content mx-auto grid w-full outline-none"
			>
				<div data-slot="alert-dialog-header" class="spartan-alert-dialog-header">
					<h2 data-slot="alert-dialog-title" class="spartan-alert-dialog-title">Are you absolutely sure?</h2>
					<p data-slot="alert-dialog-description" class="spartan-alert-dialog-description">
						This action cannot be undone. This will permanently delete your account from our servers.
					</p>
				</div>
				<div
					data-slot="alert-dialog-footer"
					class="spartan-alert-dialog-footer flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2"
				>
					<button data-slot="alert-dialog-cancel" [class]="_outline" (click)="_result.set('Cancelled'); ref.close()">
						Cancel
					</button>
					<button data-slot="alert-dialog-action" [class]="_primary" (click)="_result.set('Continued'); ref.close()">
						Continue
					</button>
				</div>
			</div>
		</ng-template>
	`,
})
export default class AlertDialogDemo {
	private readonly _overlays = inject(Overlays);
	private readonly _panel = viewChild.required<Parameters<Overlays['open']>[0]>('panel');
	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _primary = buttonVariants();
	protected readonly _size = signal<'default' | 'sm'>('default');
	protected readonly _result = signal('None yet');

	protected open(size: 'default' | 'sm') {
		this._size.set(size);
		this._overlays.open(this._panel(), { kind: 'modal' });
	}
}
