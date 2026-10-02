import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

interface Invoice {
	readonly invoice: string;
	readonly status: string;
	readonly method: string;
	readonly amount: number;
}

const INVOICES: readonly Invoice[] = [
	{ invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: 250 },
	{ invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: 150 },
	{ invoice: 'INV003', status: 'Unpaid', method: 'Transfer', amount: 350 },
	{ invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: 450 },
	{ invoice: 'INV005', status: 'Paid', method: 'PayPal', amount: 550 },
];

const PRODUCTS = [
	{ id: 'p1', name: 'Wireless Mouse', price: 29.99 },
	{ id: 'p2', name: 'Mechanical Keyboard', price: 129.99 },
	{ id: 'p3', name: 'USB-C Hub', price: 49.99 },
];

@Component({
	selector: 'table-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Invoices</h3>
			<div data-slot="table-container" class="spartan-table-container">
				<div data-slot="table" class="spartan-table flex flex-col">
					<div data-slot="table-header" class="spartan-table-header flex flex-col">
						<div data-slot="table-row" class="spartan-table-row flex flex-row">
							<div data-slot="table-head" class="spartan-table-head flex w-20 flex-row items-center">
								<span>Invoice</span>
							</div>
							<div data-slot="table-head" class="spartan-table-head flex flex-1 flex-row items-center">
								<span>Status</span>
							</div>
							<div data-slot="table-head" class="spartan-table-head flex flex-1 flex-row items-center">
								<span>Method</span>
							</div>
							<div data-slot="table-head" class="spartan-table-head flex w-20 flex-row items-center justify-end">
								<span>Amount</span>
							</div>
						</div>
					</div>
					<div data-slot="table-body" class="spartan-table-body flex flex-col">
						@for (invoice of _invoices; track invoice.invoice; let last = $last) {
							<div
								data-slot="table-row"
								class="spartan-table-row flex flex-row"
								[class.border-0]="last"
								[attr.data-state]="_selected().has(invoice.invoice) ? 'selected' : null"
								(click)="toggle(invoice.invoice)"
							>
								<div data-slot="table-cell" class="spartan-table-cell flex w-20 flex-row items-center">
									<span class="font-medium">{{ invoice.invoice }}</span>
								</div>
								<div data-slot="table-cell" class="spartan-table-cell flex flex-1 flex-row items-center">
									<span>{{ invoice.status }}</span>
								</div>
								<div data-slot="table-cell" class="spartan-table-cell flex flex-1 flex-row items-center">
									<span>{{ invoice.method }}</span>
								</div>
								<div data-slot="table-cell" class="spartan-table-cell flex w-20 flex-row items-center justify-end">
									<span>{{ currency(invoice.amount) }}</span>
								</div>
							</div>
						}
					</div>
					<div data-slot="table-footer" class="spartan-table-footer flex flex-col">
						<div data-slot="table-row" class="spartan-table-row flex flex-row border-0">
							<div data-slot="table-cell" class="spartan-table-cell flex flex-1 flex-row items-center">
								<span>{{ _selected().size ? 'Selected (' + _selected().size + ')' : 'Total' }}</span>
							</div>
							<div data-slot="table-cell" class="spartan-table-cell flex w-20 flex-row items-center justify-end">
								<span>{{ currency(_total()) }}</span>
							</div>
						</div>
					</div>
					<p data-slot="table-caption" class="spartan-table-caption text-center">
						A list of your recent invoices. Tap a row to select it.
					</p>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With actions</h3>
			<div data-slot="table-container" class="spartan-table-container">
				<div data-slot="table" class="spartan-table flex flex-col">
					<div data-slot="table-header" class="spartan-table-header flex flex-col">
						<div data-slot="table-row" class="spartan-table-row flex flex-row">
							<div data-slot="table-head" class="spartan-table-head flex flex-1 flex-row items-center">
								<span>Product</span>
							</div>
							<div data-slot="table-head" class="spartan-table-head flex w-20 flex-row items-center justify-end">
								<span>Price</span>
							</div>
							<div data-slot="table-head" class="spartan-table-head flex w-12 flex-row items-center justify-end">
								<span>Actions</span>
							</div>
						</div>
					</div>
					<div data-slot="table-body" class="spartan-table-body flex flex-col">
						@for (product of _products(); track product.id; let last = $last) {
							<div data-slot="table-row" class="spartan-table-row flex flex-row" [class.border-0]="last">
								<div data-slot="table-cell" class="spartan-table-cell flex flex-1 flex-row items-center">
									<span class="font-medium">{{ product.name }}</span>
								</div>
								<div data-slot="table-cell" class="spartan-table-cell flex w-20 flex-row items-center justify-end">
									<span>{{ currency(product.price) }}</span>
								</div>
								<div data-slot="table-cell" class="spartan-table-cell flex w-12 flex-row items-center justify-end">
									<button [class]="_iconButton" (click)="remove(product.id)"><ui-icon name="lucideTrash2" /></button>
								</div>
							</div>
						} @empty {
							<div data-slot="table-row" class="spartan-table-row flex flex-row border-0">
								<div
									data-slot="table-cell"
									class="spartan-table-cell flex h-24 flex-1 flex-row items-center justify-center"
								>
									<span>No products.</span>
								</div>
							</div>
						}
					</div>
				</div>
			</div>
			<button [class]="_outlineButton" (click)="reset()">Reset products</button>
		</section>
	`,
})
export default class TableDemo {
	protected readonly _invoices = INVOICES;
	protected readonly _selected = signal<ReadonlySet<string>>(new Set());
	protected readonly _total = computed(() => {
		const selected = this._selected();
		const rows = selected.size ? INVOICES.filter((invoice) => selected.has(invoice.invoice)) : INVOICES;
		return rows.reduce((sum, invoice) => sum + invoice.amount, 0);
	});
	protected readonly _products = signal(PRODUCTS);
	protected readonly _iconButton = buttonVariants({ variant: 'ghost', size: 'icon-sm' });
	protected readonly _outlineButton = buttonVariants({ variant: 'outline', size: 'sm' });

	protected currency(amount: number) {
		return `$${amount.toFixed(2)}`;
	}

	protected toggle(id: string) {
		this._selected.update((selected) => {
			const next = new Set(selected);
			if (!next.delete(id)) next.add(id);
			return next;
		});
	}

	protected remove(id: string) {
		this._products.update((products) => products.filter((product) => product.id !== id));
	}

	protected reset() {
		this._products.set(PRODUCTS);
	}
}
