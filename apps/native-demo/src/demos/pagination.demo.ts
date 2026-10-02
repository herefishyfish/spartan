import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsLeft, lucideChevronsRight } from '@ng-icons/lucide';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';

const PAGE_COUNT = 10;

@Component({
	selector: 'pagination-demo',
	imports: [HlmPaginationImports, NgIcon],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [provideIcons({ lucideChevronsLeft, lucideChevronsRight })],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			<nav hlmPagination>
				<!-- MasonKit gives ul the browser's list margin, indent and markers. -->
				<ul hlmPaginationContent class="m-0 list-none p-0">
					<li hlmPaginationItem [class.opacity-50]="_page() === 1">
						<hlm-pagination-previous (click)="goTo(_page() - 1)" />
					</li>
					@for (item of _window(); track $index) {
						<li hlmPaginationItem>
							@if (item === null) {
								<hlm-pagination-ellipsis />
							} @else {
								<a hlmPaginationLink [isActive]="item === _page()" (click)="goTo(item)">{{ item }}</a>
							}
						</li>
					}
					<li hlmPaginationItem [class.opacity-50]="_page() === _pageCount">
						<hlm-pagination-next (click)="goTo(_page() + 1)" />
					</li>
				</ul>
			</nav>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Icon only</h3>
			<nav hlmPagination>
				<ul hlmPaginationContent class="m-0 list-none p-0">
					<li hlmPaginationItem [class.opacity-50]="_page() === 1">
						<a hlmPaginationLink aria-label="Go to first page" (click)="goTo(1)">
							<ng-icon name="lucideChevronsLeft" />
						</a>
					</li>
					<li hlmPaginationItem [class.opacity-50]="_page() === 1">
						<hlm-pagination-previous iconOnly (click)="goTo(_page() - 1)" />
					</li>
					<li hlmPaginationItem class="px-2 text-sm font-medium">Page {{ _page() }} of {{ _pageCount }}</li>
					<li hlmPaginationItem [class.opacity-50]="_page() === _pageCount">
						<hlm-pagination-next iconOnly (click)="goTo(_page() + 1)" />
					</li>
					<li hlmPaginationItem [class.opacity-50]="_page() === _pageCount">
						<a hlmPaginationLink aria-label="Go to last page" (click)="goTo(_pageCount)">
							<ng-icon name="lucideChevronsRight" />
						</a>
					</li>
				</ul>
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

	protected goTo(page: number) {
		this._page.set(Math.min(Math.max(page, 1), PAGE_COUNT));
	}
}
