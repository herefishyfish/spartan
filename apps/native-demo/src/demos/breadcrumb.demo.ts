import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSlash } from '@ng-icons/lucide';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButton } from '@spartan-ng/helm/button';

// Items are divs, not li: MasonKit's li lays out text runs and ignores helm's inline-flex.
@Component({
	selector: 'breadcrumb-demo',
	imports: [HlmBreadcrumbImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideSlash })],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			<nav hlmBreadcrumb>
				<div hlmBreadcrumbList>
					@for (crumb of _trail(); track crumb; let last = $last) {
						<div hlmBreadcrumbItem>
							@if (last) {
								<span hlmBreadcrumbPage>{{ crumb }}</span>
							} @else {
								<a hlmBreadcrumbLink (click)="open(crumb)">{{ crumb }}</a>
							}
						</div>
						@if (!last) {
							<div hlmBreadcrumbSeparator></div>
						}
					}
				</div>
			</nav>
			@if (_trail().length < _pages.length) {
				<button hlmBtn variant="outline" size="sm" class="self-start" (click)="_trail.set(_pages)">Reset trail</button>
			}
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Collapsed</h3>
			<nav hlmBreadcrumb>
				<div hlmBreadcrumbList>
					<div hlmBreadcrumbItem>
						<a hlmBreadcrumbLink>Home</a>
					</div>
					<div hlmBreadcrumbSeparator></div>
					@if (_expanded()) {
						@for (crumb of _hidden; track crumb) {
							<div hlmBreadcrumbItem>
								<a hlmBreadcrumbLink>{{ crumb }}</a>
							</div>
							<div hlmBreadcrumbSeparator></div>
						}
					} @else {
						<div hlmBreadcrumbItem (click)="_expanded.set(true)">
							<hlm-breadcrumb-ellipsis />
						</div>
						<div hlmBreadcrumbSeparator></div>
					}
					<div hlmBreadcrumbItem>
						<span hlmBreadcrumbPage>Breadcrumb</span>
					</div>
				</div>
			</nav>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Custom separator</h3>
			<nav hlmBreadcrumb>
				<div hlmBreadcrumbList>
					@for (crumb of ['Home', 'Components']; track crumb) {
						<div hlmBreadcrumbItem>
							<a hlmBreadcrumbLink>{{ crumb }}</a>
						</div>
						<div hlmBreadcrumbSeparator>
							<ng-icon name="lucideSlash" />
						</div>
					}
					<div hlmBreadcrumbItem>
						<span hlmBreadcrumbPage>Breadcrumb</span>
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

	protected open(crumb: string) {
		this._trail.set(this._pages.slice(0, this._pages.indexOf(crumb) + 1));
	}
}
