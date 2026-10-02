import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Icon } from '../ui/icon';

@Component({
	selector: 'accordion-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="accordion" class="spartan-accordion flex w-full flex-col">
			@for (item of _items; track item.id) {
				<div
					data-slot="accordion-item"
					class="spartan-accordion-item flex flex-col"
					[attr.data-state]="_open() === item.id ? 'open' : 'closed'"
				>
					<div
						role="button"
						data-slot="accordion-trigger"
						class="spartan-accordion-trigger relative flex flex-1 flex-row items-start justify-between border border-transparent"
						(click)="toggle(item.id)"
					>
						<span>{{ item.title }}</span>
						<ui-icon
							data-slot="accordion-trigger-icon"
							class="text-muted-foreground"
							[name]="_open() === item.id ? 'lucideChevronUp' : 'lucideChevronDown'"
						/>
					</div>
					@if (_open() === item.id) {
						<div data-slot="accordion-content" class="spartan-accordion-content">
							<p class="spartan-accordion-content-inner">{{ item.body }}</p>
						</div>
					}
				</div>
			}
		</div>
	`,
})
export default class AccordionDemo {
	protected readonly _items = [
		{ id: 'a11y', title: 'Is it accessible?', body: 'Yes. It adheres to the WAI-ARIA design pattern.' },
		{
			id: 'styled',
			title: 'Is it styled?',
			body: 'Yes. It comes with default styles that match the other components.',
		},
		{
			id: 'animated',
			title: 'Is it animated?',
			body: 'Yes. It is animated by default, but you can disable it if you prefer.',
		},
	];
	protected readonly _open = signal<string | null>('a11y');

	protected toggle(id: string) {
		this._open.set(this._open() === id ? null : id);
	}
}
