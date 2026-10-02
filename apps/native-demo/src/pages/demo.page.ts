import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import {
	Component,
	DestroyRef,
	ElementRef,
	NO_ERRORS_SCHEMA,
	ViewContainerRef,
	computed,
	effect,
	inject,
	resource,
	signal,
	viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import type { Drawer } from '@nativescript-community/ui-drawer';
import { DrawerModule } from '@nativescript-community/ui-drawer/angular';
import { NativeScriptCommonModule } from '@nativescript/angular';
import type { View } from '@nativescript/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { map } from 'rxjs/operators';
import { findDemo } from '../demos/registry';
import { Icon, type IconName } from '../ui/icon';
import { Overlays, type SheetSide, type ToastType } from '../ui/overlays';

/** hlm-toaster's defaults: three visible toasts, with lucide type icons. */
const VISIBLE_TOASTS = 3;
const TOAST_ICONS: Record<ToastType, IconName | null> = {
	default: null,
	success: 'lucideCircleCheck',
	info: 'lucideInfo',
	warning: 'lucideTriangleAlert',
	error: 'lucideOctagonX',
};

@Component({
	selector: 'demo-page',
	imports: [NativeScriptCommonModule, NgComponentOutlet, NgTemplateOutlet, DrawerModule, Icon],
	schemas: [NO_ERRORS_SCHEMA],
	template: `
		<ActionBar [title]="_demo()?.name ?? 'Not found'" />
		<!--
			The native drawer hosts edge sheets. Every GridLayout child fills the page, so each overlay layer is a direct
			child. The theme class sits on the roots because spartan's rules are descendant selectors
			(.style-vega .spartan-*), and MasonKit roots get explicit sizes because they only resolve percentages and
			alignment for their children against those. The drawer finds its slots by id when a child is inserted,
			before the slot directives set it, so the ids are static.
		-->
		<Drawer #drawer backdropColor="rgba(0, 0, 0, 0.1)" [gestureEnabled]="!!_overlays.sheet()" (close)="_sheetClosed()">
			<GridLayout mainContent id="MainContent" #host class="style-vega" (layoutChanged)="_measure()">
				<ScrollView>
					<div class="bg-background text-foreground flex w-full flex-col">
						<div class="flex w-full flex-col gap-6 p-6">
							@if (_component.value(); as type) {
								<ng-container *ngComponentOutlet="type" />
							}
						</div>
					</div>
				</ScrollView>
				@for (entry of _overlays.stack(); track entry.id) {
					<div class="spartan-dialog-overlay" data-state="open" (click)="entry.ref.close()"></div>
					<div
						class="text-foreground flex flex-col p-4"
						verticalAlignment="middle"
						[width]="_hostSize().width"
						(click)="consume()"
					>
						<ng-container *ngTemplateOutlet="entry.template; context: { $implicit: entry.ref }" />
					</div>
				}
				@if (_toasts().length) {
					<div
						data-sonner-toaster
						class="toaster group flex flex-col gap-2 p-4"
						verticalAlignment="bottom"
						[width]="_hostSize().width"
					>
						@for (toast of _toasts(); track toast.id) {
							<div
								data-sonner-toast
								[attr.data-type]="toast.type ?? 'default'"
								class="spartan-toast bg-popover text-popover-foreground border-border flex flex-row items-center gap-1.5 rounded-lg border p-4 text-[13px] shadow-lg"
							>
								@if (_toastIcons[toast.type ?? 'default']; as icon) {
									<ui-icon data-icon [name]="icon" class="text-base" />
								}
								<div data-content class="flex flex-1 flex-col gap-0.5">
									<span data-title class="font-medium">{{ toast.title }}</span>
									@if (toast.description) {
										<span data-description class="text-muted-foreground">{{ toast.description }}</span>
									}
								</div>
								@if (toast.action; as action) {
									<button data-button [class]="_toastAction" (click)="action.onClick(); toast.ref.close()">
										{{ action.label }}
									</button>
								}
							</div>
						}
					</div>
				}
			</GridLayout>
			<div
				leftDrawer
				id="LeftDrawer"
				class="style-vega ui-sheet-slot flex flex-col"
				[width]="_sideWidth()"
				[height]="_hostSize().height"
			>
				<ng-container *ngTemplateOutlet="_sheetTemplate('left'); context: _sheetContext()" />
			</div>
			<div
				rightDrawer
				id="RightDrawer"
				class="style-vega ui-sheet-slot flex flex-col"
				[width]="_sideWidth()"
				[height]="_hostSize().height"
			>
				<ng-container *ngTemplateOutlet="_sheetTemplate('right'); context: _sheetContext()" />
			</div>
			<div topDrawer id="TopDrawer" class="style-vega ui-sheet-slot flex flex-col" [width]="_hostSize().width">
				<ng-container *ngTemplateOutlet="_sheetTemplate('top'); context: _sheetContext()" />
			</div>
			<div bottomDrawer id="BottomDrawer" class="style-vega ui-sheet-slot flex flex-col" [width]="_hostSize().width">
				<ng-container *ngTemplateOutlet="_sheetTemplate('bottom'); context: _sheetContext()" />
			</div>
		</Drawer>
	`,
})
export class DemoPage {
	private readonly _host = viewChild.required('host', { read: ElementRef<View> });
	private readonly _drawer = viewChild.required('drawer', { read: ElementRef<Drawer> });
	private readonly _slug = toSignal(inject(ActivatedRoute).paramMap.pipe(map((params) => params.get('slug') ?? '')), {
		initialValue: '',
	});
	protected readonly _overlays = inject(Overlays);
	protected readonly _hostSize = signal({ width: 0, height: 0 });
	/** spartan's side sheets are w-3/4 of the viewport. */
	protected readonly _sideWidth = computed(() => this._hostSize().width * 0.75);
	protected readonly _toasts = computed(() => this._overlays.toasts().slice(-VISIBLE_TOASTS));
	protected readonly _toastIcons = TOAST_ICONS;
	protected readonly _toastAction = buttonVariants({ size: 'sm' });
	protected readonly _demo = computed(() => findDemo(this._slug()));
	protected readonly _component = resource({
		params: () => this._demo(),
		loader: ({ params }) => params.load(),
	});
	protected readonly _sheetContext = computed(() => ({ $implicit: this._overlays.sheet()?.ref }));

	constructor() {
		this._overlays.attach(inject(ViewContainerRef));
		inject(DestroyRef).onDestroy(() => this._overlays.closeAll());
		effect(() => {
			const sheet = this._overlays.sheet();
			const drawer = this._drawer().nativeElement;
			// Open once the template has rendered into its slot.
			if (sheet) setTimeout(() => drawer.open(sheet.side));
			else drawer.close();
		});
	}

	protected _sheetTemplate(side: SheetSide) {
		const sheet = this._overlays.sheet();
		return sheet?.side === side ? sheet.template : null;
	}

	protected _sheetClosed() {
		this._overlays.sheet()?.ref.close();
	}

	protected _measure() {
		const { width, height } = this._host().nativeElement.getActualSize();
		const size = this._hostSize();
		if (size.width !== width || size.height !== height) this._hostSize.set({ width, height });
	}

	protected consume() {
		// Taps inside a panel must not fall through to the backdrop underneath it.
	}
}
