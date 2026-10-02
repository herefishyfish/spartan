import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { PagerModule } from '@nativescript-community/ui-pager/angular';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

@Component({
	selector: 'carousel-demo',
	imports: [PagerModule, Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="carousel" class="relative flex flex-col gap-3">
			<Pager
				(layoutChanged)="_pageWidth.set($any($event).object.getActualSize().width)"
				height="240"
				[items]="_slides"
				[selectedIndex]="_index()"
				(selectedIndexChange)="_index.set($any($event).value)"
			>
				<ng-template let-slide>
					<!-- A MasonKit root inside the native pager only sizes its children against explicit dimensions. -->
					<div data-slot="carousel-item" height="220" [width]="_pageWidth()" class="flex flex-col px-1">
						<div data-slot="card" class="spartan-card flex h-full flex-col">
							<div
								data-slot="card-content"
								class="spartan-card-content flex h-full flex-col items-center justify-center"
							>
								<span class="text-4xl font-semibold">{{ slide }}</span>
							</div>
						</div>
					</div>
				</ng-template>
			</Pager>
			<div class="flex flex-row items-center justify-center gap-4">
				<button
					data-slot="carousel-previous"
					[class]="_nav + ' spartan-carousel-previous h-8 w-8'"
					[attr.data-disabled]="_index() === 0 ? '' : null"
					(click)="go(-1)"
				>
					<ui-icon name="lucideArrowLeft" />
				</button>
				<span data-slot="carousel-slide-display" class="text-muted-foreground text-sm">
					Slide {{ _index() + 1 }} of {{ _slides.length }}
				</span>
				<button
					data-slot="carousel-next"
					[class]="_nav + ' spartan-carousel-next h-8 w-8'"
					[attr.data-disabled]="_index() === _slides.length - 1 ? '' : null"
					(click)="go(1)"
				>
					<ui-icon name="lucideArrowRight" />
				</button>
			</div>
		</div>
		<p class="text-muted-foreground text-sm">
			Swipe the native pager (&#64;nativescript-community/ui-pager) or use the buttons.
		</p>
	`,
})
export default class CarouselDemo {
	protected readonly _slides = [1, 2, 3, 4, 5];
	protected readonly _index = signal(0);
	protected readonly _pageWidth = signal(0);
	protected readonly _nav = buttonVariants({ variant: 'outline', size: 'icon-sm' });

	protected go(step: number) {
		this._index.set(Math.min(this._slides.length - 1, Math.max(0, this._index() + step)));
	}
}
