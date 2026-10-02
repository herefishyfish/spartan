import { NgTemplateOutlet } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { BottomSheetParams } from '@nativescript-community/ui-material-bottomsheet/angular';
import type { OverlayRef, OverlayTemplate } from './overlays';

/** Renders an overlay template inside the native bottom sheet, which only accepts a component. */
@Component({
	selector: 'ui-sheet-host',
	imports: [NgTemplateOutlet],
	schemas: [NO_ERRORS_SCHEMA],
	template: `
		<div class="style-vega text-foreground">
			<ng-container *ngTemplateOutlet="_context.template; context: { $implicit: _context.ref }" />
		</div>
	`,
})
export class SheetHost {
	protected readonly _context = inject(BottomSheetParams).context as { template: OverlayTemplate; ref: OverlayRef };
}
