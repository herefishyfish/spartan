import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';

@Component({
	selector: 'accordion-demo',
	imports: [HlmAccordionImports],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<hlm-accordion>
			@for (item of _items; track item.id; let first = $first) {
				<hlm-accordion-item [isOpened]="first">
					<hlm-accordion-trigger>{{ item.title }}</hlm-accordion-trigger>
					<hlm-accordion-content>
						<p>{{ item.body }}</p>
					</hlm-accordion-content>
				</hlm-accordion-item>
			}
		</hlm-accordion>
	`,
})
export default class AccordionDemo {
	protected readonly _items = [
		{
			id: 'shipping',
			title: 'What are your shipping options?',
			body: 'We offer standard (5-7 days), express (2-3 days), and overnight shipping. Free shipping on international orders.',
		},
		{
			id: 'returns',
			title: 'What is your return policy?',
			body: 'Returns accepted within 30 days. Items must be unused and in original packaging. Refunds processed within 5-7 business days.',
		},
		{
			id: 'support',
			title: 'How can I contact customer support?',
			body: 'Reach us via email, live chat, or phone. We respond within 24 hours during business days.',
		},
	];
}
