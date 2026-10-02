import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

type Status = 'pending' | 'processing' | 'success' | 'failed';
type SortDirection = 'asc' | 'desc' | null;

interface Payment {
	readonly id: string;
	readonly status: Status;
	readonly email: string;
	readonly amount: number;
}

const PAYMENTS: readonly Payment[] = [
	{ id: 'm5gr84i9', status: 'success', email: 'ken99@yahoo.com', amount: 316 },
	{ id: '3u1reuv4', status: 'success', email: 'abe45@gmail.com', amount: 242 },
	{ id: 'derv1ws0', status: 'processing', email: 'monse@hotmail.com', amount: 837 },
	{ id: '5kma53ae', status: 'success', email: 'silas@gmail.com', amount: 874 },
	{ id: 'bhqecj4p', status: 'failed', email: 'carmel@hotmail.com', amount: 721 },
	{ id: 'p0r8sd1x', status: 'pending', email: 'jolie@proton.me', amount: 118 },
	{ id: 'a7k2mq9z', status: 'success', email: 'ravi@outlook.com', amount: 504 },
	{ id: 'x9w3lt6c', status: 'processing', email: 'nora@icloud.com', amount: 96 },
];

const PAGE_SIZE = 5;

@Component({
	selector: 'data-table-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-4' },
	template: `
		<div class="flex flex-row items-center gap-2">
			<input
				data-slot="input"
				class="spartan-input w-full min-w-0 flex-1 outline-none"
				placeholder="Filter emails..."
				[value]="_filter()"
				(input)="setFilter($any($event).target.value)"
			/>
			<button [class]="_outline" (click)="_showStatus.set(!_showStatus())">
				<span>{{ _showStatus() ? 'Hide status' : 'Show status' }}</span>
			</button>
		</div>
		<div class="flex flex-col overflow-hidden rounded-md border">
			<div data-slot="table-container" class="spartan-table-container">
				<div data-slot="table" class="spartan-table flex flex-col">
					<div data-slot="table-header" class="spartan-table-header flex flex-col">
						<div data-slot="table-row" class="spartan-table-row flex flex-row">
							<div data-slot="table-head" class="spartan-table-head flex w-10 flex-row items-center pe-0">
								<div
									role="checkbox"
									data-slot="checkbox"
									class="spartan-checkbox peer shrink-0 cursor-default outline-none"
									[attr.data-state]="_pageSelected() ? 'checked' : 'unchecked'"
									(click)="togglePage()"
								>
									@if (_pageSelected()) {
										<div class="spartan-checkbox-indicator flex items-center justify-center">
											<ui-icon name="lucideCheck" />
										</div>
									}
								</div>
							</div>
							@if (_showStatus()) {
								<div data-slot="table-head" class="spartan-table-head flex w-20 flex-row items-center">
									<span>Status</span>
								</div>
							}
							<div data-slot="table-head" class="spartan-table-head flex flex-1 flex-row items-center">
								<button [class]="_ghost" (click)="cycleSort()">
									<span>Email</span>
									<ui-icon
										[name]="
											_sort() === 'asc' ? 'lucideArrowUp' : _sort() === 'desc' ? 'lucideArrowDown' : 'lucideArrowUpDown'
										"
									/>
								</button>
							</div>
							<div data-slot="table-head" class="spartan-table-head flex w-20 flex-row items-center justify-end">
								<span>Amount</span>
							</div>
						</div>
					</div>
					<div data-slot="table-body" class="spartan-table-body flex flex-col">
						@for (payment of _pageRows(); track payment.id; let last = $last) {
							<div
								data-slot="table-row"
								class="spartan-table-row flex flex-row"
								[class.border-0]="last"
								[attr.data-state]="_selected().has(payment.id) ? 'selected' : null"
							>
								<div data-slot="table-cell" class="spartan-table-cell flex w-10 flex-row items-center pe-0">
									<div
										role="checkbox"
										data-slot="checkbox"
										class="spartan-checkbox peer shrink-0 cursor-default outline-none"
										[attr.data-state]="_selected().has(payment.id) ? 'checked' : 'unchecked'"
										(click)="toggle(payment.id)"
									>
										@if (_selected().has(payment.id)) {
											<div class="spartan-checkbox-indicator flex items-center justify-center">
												<ui-icon name="lucideCheck" />
											</div>
										}
									</div>
								</div>
								@if (_showStatus()) {
									<div data-slot="table-cell" class="spartan-table-cell flex w-20 flex-row items-center">
										<span class="capitalize">{{ payment.status }}</span>
									</div>
								}
								<div data-slot="table-cell" class="spartan-table-cell flex flex-1 flex-row items-center">
									<span>{{ payment.email }}</span>
								</div>
								<div data-slot="table-cell" class="spartan-table-cell flex w-20 flex-row items-center justify-end">
									<span class="font-medium">{{ '$' + payment.amount.toFixed(2) }}</span>
								</div>
							</div>
						} @empty {
							<div data-slot="table-row" class="spartan-table-row flex flex-row border-0">
								<div
									data-slot="table-cell"
									class="spartan-table-cell flex h-24 flex-1 flex-row items-center justify-center"
								>
									<span>No results.</span>
								</div>
							</div>
						}
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-row items-center justify-between gap-2">
			<p class="text-muted-foreground text-sm">{{ _selected().size }} of {{ _rows().length }} row(s) selected</p>
			<div class="flex flex-row gap-2">
				<button [class]="_small" [attr.data-disabled]="_page() === 0 ? '' : null" (click)="goTo(_page() - 1)">
					Previous
				</button>
				<button
					[class]="_small"
					[attr.data-disabled]="_page() >= _pageCount() - 1 ? '' : null"
					(click)="goTo(_page() + 1)"
				>
					Next
				</button>
			</div>
		</div>
	`,
})
export default class DataTableDemo {
	protected readonly _filter = signal('');
	protected readonly _sort = signal<SortDirection>(null);
	protected readonly _page = signal(0);
	protected readonly _showStatus = signal(false);
	protected readonly _selected = signal<ReadonlySet<string>>(new Set());

	protected readonly _rows = computed(() => {
		const query = this._filter().trim().toLowerCase();
		const rows = PAYMENTS.filter((payment) => payment.email.includes(query));
		const sort = this._sort();
		if (!sort) return rows;
		const direction = sort === 'asc' ? 1 : -1;
		return [...rows].sort((a, b) => a.email.localeCompare(b.email) * direction);
	});
	protected readonly _pageCount = computed(() => Math.max(1, Math.ceil(this._rows().length / PAGE_SIZE)));
	protected readonly _pageRows = computed(() =>
		this._rows().slice(this._page() * PAGE_SIZE, (this._page() + 1) * PAGE_SIZE),
	);
	protected readonly _pageSelected = computed(
		() => this._pageRows().length > 0 && this._pageRows().every((payment) => this._selected().has(payment.id)),
	);

	protected readonly _outline = buttonVariants({ variant: 'outline' });
	protected readonly _ghost = buttonVariants({ variant: 'ghost', size: 'sm' });
	protected readonly _small = buttonVariants({ variant: 'outline', size: 'sm' });

	protected setFilter(value: string) {
		this._filter.set(value);
		this._page.set(0);
	}

	protected cycleSort() {
		this._sort.update((sort) => (sort === null ? 'asc' : sort === 'asc' ? 'desc' : null));
	}

	protected goTo(page: number) {
		this._page.set(Math.min(Math.max(page, 0), this._pageCount() - 1));
	}

	protected toggle(id: string) {
		this._selected.update((selected) => {
			const next = new Set(selected);
			if (!next.delete(id)) next.add(id);
			return next;
		});
	}

	protected togglePage() {
		const ids = this._pageRows().map((payment) => payment.id);
		const select = !this._pageSelected();
		this._selected.update((selected) => {
			const next = new Set(selected);
			for (const id of ids) {
				if (select) next.add(id);
				else next.delete(id);
			}
			return next;
		});
	}
}
