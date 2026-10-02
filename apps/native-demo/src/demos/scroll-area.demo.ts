import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { hlmSeparatorClass } from '@spartan-ng/helm/separator';

@Component({
	selector: 'scroll-area-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="scroll-area" class="spartan-scroll-area block h-72 w-48 overflow-y-auto border">
			<div class="flex flex-col p-4">
				<h4 class="mb-4 text-sm leading-none font-medium">Tags</h4>
				@for (tag of _tags; track tag) {
					<div class="flex flex-col text-sm">
						<span>{{ tag }}</span>
						<div
							data-slot="separator"
							data-orientation="horizontal"
							role="none"
							class="my-2"
							[class]="_separator"
						></div>
					</div>
				}
			</div>
		</div>
	`,
})
export default class ScrollAreaDemo {
	protected readonly _tags = Array.from({ length: 50 }, (_, i) => `v1.2.0-beta.${50 - i}`);
	protected readonly _separator = hlmSeparatorClass;
}
