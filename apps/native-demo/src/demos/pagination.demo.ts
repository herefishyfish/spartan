import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { type ButtonVariants, buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

const PAGE_COUNT = 10;

@Component({
	selector: 'pagination-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			<nav
				data-slot="pagination"
				role="navigation"
				aria-label="pagination"
				class="spartan-pagination mx-auto flex w-full flex-row justify-center"
			>
				<div data-slot="pagination-content" class="spartan-pagination-content flex flex-row items-center">
					<div data-slot="pagination-item">
						<button
							data-slot="pagination-link"
							aria-label="Go to previous page"
							[class]="'spartan-pagination-previous ' + link(false, 'default')"
							[attr.data-disabled]="_page() === 1 ? '' : null"
							(click)="goTo(_page() - 1)"
						>
							<ui-icon name="lucideChevronLeft" />
						</button>
					</div>
					@for (item of _window(); track $index) {
						<div data-slot="pagination-item">
							@if (item === null) {
								<div
									data-slot="pagination-ellipsis"
									class="spartan-pagination-ellipsis flex items-center justify-center"
								>
									<ui-icon name="lucideEllipsis" />
								</div>
							} @else {
								<button
									data-slot="pagination-link"
									[class]="link(item === _page())"
									[attr.data-active]="item === _page() ? 'true' : null"
									(click)="goTo(item)"
								>
									{{ item }}
								</button>
							}
						</div>
					}
					<div data-slot="pagination-item">
						<button
							data-slot="pagination-link"
							aria-label="Go to next page"
							[class]="'spartan-pagination-next ' + link(false, 'default')"
							[attr.data-disabled]="_page() === _pageCount ? '' : null"
							(click)="goTo(_page() + 1)"
						>
							<ui-icon name="lucideChevronRight" />
						</button>
					</div>
				</div>
			</nav>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Icon only</h3>
			<nav
				data-slot="pagination"
				role="navigation"
				aria-label="pagination"
				class="spartan-pagination mx-auto flex w-full flex-row justify-center"
			>
				<div data-slot="pagination-content" class="spartan-pagination-content flex flex-row items-center">
					<div data-slot="pagination-item">
						<button
							data-slot="pagination-link"
							aria-label="Go to first page"
							[class]="link(false)"
							[attr.data-disabled]="_page() === 1 ? '' : null"
							(click)="goTo(1)"
						>
							<ui-icon name="lucideChevronsLeft" />
						</button>
					</div>
					<div data-slot="pagination-item">
						<button
							data-slot="pagination-link"
							aria-label="Go to previous page"
							[class]="link(false)"
							[attr.data-disabled]="_page() === 1 ? '' : null"
							(click)="goTo(_page() - 1)"
						>
							<ui-icon name="lucideChevronLeft" />
						</button>
					</div>
					<div data-slot="pagination-item" class="px-2">
						<span class="text-sm font-medium">Page {{ _page() }} of {{ _pageCount }}</span>
					</div>
					<div data-slot="pagination-item">
						<button
							data-slot="pagination-link"
							aria-label="Go to next page"
							[class]="link(false)"
							[attr.data-disabled]="_page() === _pageCount ? '' : null"
							(click)="goTo(_page() + 1)"
						>
							<ui-icon name="lucideChevronRight" />
						</button>
					</div>
					<div data-slot="pagination-item">
						<button
							data-slot="pagination-link"
							aria-label="Go to last page"
							[class]="link(false)"
							[attr.data-disabled]="_page() === _pageCount ? '' : null"
							(click)="goTo(_pageCount)"
						>
							<ui-icon name="lucideChevronsRight" />
						</button>
					</div>
				</div>
			</nav>
		</section>
	`,
})
export default class PaginationDemo {
	protected readonly _pageCount = PAGE_COUNT;
	protected readonly _page = signal(2);
	protected readonly _window = computed<readonly (number | null)[]>(() => {
		const page = this._page();
		const start = Math.min(Math.max(page - 1, 1), PAGE_COUNT - 2);
		const pages: (number | null)[] = [start, start + 1, start + 2];
		if (start + 2 < PAGE_COUNT) pages.push(null);
		return pages;
	});

	protected link(active: boolean, size: ButtonVariants['size'] = 'icon') {
		return `spartan-pagination-link relative ${buttonVariants({ variant: active ? 'outline' : 'ghost', size })} cursor-pointer`;
	}

	protected goTo(page: number) {
		this._page.set(Math.min(Math.max(page, 1), PAGE_COUNT));
	}
}
