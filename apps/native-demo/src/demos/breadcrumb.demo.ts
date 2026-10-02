import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

@Component({
	selector: 'breadcrumb-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			<nav data-slot="breadcrumb" role="navigation" aria-label="breadcrumb">
				<div data-slot="breadcrumb-list" [class]="_list">
					@for (crumb of _trail(); track crumb; let last = $last) {
						<div data-slot="breadcrumb-item" [class]="_item">
							@if (last) {
								<span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" [class]="_page">
									{{ crumb }}
								</span>
							} @else {
								<a data-slot="breadcrumb-link" [class]="_link" (click)="open(crumb)">{{ crumb }}</a>
							}
						</div>
						@if (!last) {
							<div data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" [class]="_separator">
								<ui-icon name="lucideChevronRight" />
							</div>
						}
					}
				</div>
			</nav>
			@if (_trail().length < _pages.length) {
				<button [class]="_reset + ' self-start'" (click)="_trail.set(_pages)">Reset trail</button>
			}
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Collapsed</h3>
			<nav data-slot="breadcrumb" role="navigation" aria-label="breadcrumb">
				<div data-slot="breadcrumb-list" [class]="_list">
					<div data-slot="breadcrumb-item" [class]="_item">
						<a data-slot="breadcrumb-link" [class]="_link">Home</a>
					</div>
					<div data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" [class]="_separator">
						<ui-icon name="lucideChevronRight" />
					</div>
					@if (_expanded()) {
						@for (crumb of _hidden; track crumb) {
							<div data-slot="breadcrumb-item" [class]="_item">
								<a data-slot="breadcrumb-link" [class]="_link">{{ crumb }}</a>
							</div>
							<div data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" [class]="_separator">
								<ui-icon name="lucideChevronRight" />
							</div>
						}
					} @else {
						<div data-slot="breadcrumb-item" [class]="_item" (click)="_expanded.set(true)">
							<div
								data-slot="breadcrumb-ellipsis"
								role="presentation"
								class="spartan-breadcrumb-ellipsis flex items-center justify-center"
							>
								<ui-icon name="lucideEllipsis" class="text-base" />
							</div>
						</div>
						<div data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" [class]="_separator">
							<ui-icon name="lucideChevronRight" />
						</div>
					}
					<div data-slot="breadcrumb-item" [class]="_item">
						<span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" [class]="_page">
							Breadcrumb
						</span>
					</div>
				</div>
			</nav>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Custom separator</h3>
			<nav data-slot="breadcrumb" role="navigation" aria-label="breadcrumb">
				<div data-slot="breadcrumb-list" [class]="_list">
					@for (crumb of ['Home', 'Components']; track crumb) {
						<div data-slot="breadcrumb-item" [class]="_item">
							<a data-slot="breadcrumb-link" [class]="_link">{{ crumb }}</a>
						</div>
						<div data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" [class]="_separator">
							<ui-icon name="lucideSlash" />
						</div>
					}
					<div data-slot="breadcrumb-item" [class]="_item">
						<span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" [class]="_page">
							Breadcrumb
						</span>
					</div>
				</div>
			</nav>
		</section>
	`,
})
export default class BreadcrumbDemo {
	protected readonly _pages = ['Home', 'Components', 'Navigation', 'Breadcrumb'];
	protected readonly _trail = signal(this._pages);
	protected readonly _hidden = ['Documentation', 'Components'];
	protected readonly _expanded = signal(false);
	protected readonly _reset = buttonVariants({ variant: 'outline', size: 'sm' });
	protected readonly _list = 'spartan-breadcrumb-list flex flex-row flex-wrap items-center wrap-break-word';
	protected readonly _item = 'spartan-breadcrumb-item inline-flex flex-row items-center';
	protected readonly _link = 'spartan-breadcrumb-link';
	protected readonly _page = 'spartan-breadcrumb-page';
	protected readonly _separator = 'spartan-breadcrumb-separator [&>ng-icon]:flex';

	protected open(crumb: string) {
		this._trail.set(this._pages.slice(0, this._pages.indexOf(crumb) + 1));
	}
}
