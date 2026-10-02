import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import type { BadgeVariants } from '@spartan-ng/helm/badge';
import { Icon } from '../ui/icon';

@Component({
	selector: 'badge-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Variants</h3>
			<div class="flex flex-row flex-wrap gap-2">
				@for (variant of _variants; track variant) {
					<div data-slot="badge" [attr.data-variant]="variant" [class]="_badge(variant)">{{ variant }}</div>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With icons</h3>
			<div class="flex flex-row flex-wrap gap-2">
				<div data-slot="badge" data-variant="secondary" [class]="_badge('secondary')">
					<ui-icon name="lucideBadgeCheck" data-icon="inline-start" />
					<span>Verified</span>
				</div>
				<div data-slot="badge" data-variant="outline" [class]="_badge('outline')">
					<span>Bookmark</span>
					<ui-icon name="lucideBookmark" data-icon="inline-end" />
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With spinner</h3>
			<div class="flex flex-row flex-wrap gap-2">
				<div data-slot="badge" data-variant="destructive" [class]="_badge('destructive')">
					<ui-icon
						data-slot="spinner"
						role="status"
						aria-label="Loading"
						name="lucideLoaderCircle"
						class="inline-flex animate-spin text-xs"
					/>
					<span>Deleting</span>
				</div>
				<div data-slot="badge" data-variant="outline" [class]="_badge('outline')">
					<span>Syncing</span>
					<ui-icon
						data-slot="spinner"
						role="status"
						aria-label="Loading"
						name="lucideLoaderCircle"
						class="inline-flex animate-spin text-xs"
					/>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Pressable</h3>
			<div class="flex flex-row flex-wrap gap-2">
				<div
					data-slot="badge"
					[attr.data-variant]="_following() ? 'default' : 'outline'"
					[class]="_badge(_following() ? 'default' : 'outline')"
					(click)="_following.set(!_following())"
				>
					<ui-icon [name]="_following() ? 'lucideCheck' : 'lucidePlus'" />
					<span>{{ _following() ? 'Following' : 'Follow' }}</span>
				</div>
			</div>
		</section>
	`,
})
export default class BadgeDemo {
	protected readonly _variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const;
	protected readonly _following = signal(false);
	protected readonly _badge = (variant: BadgeVariants['variant']) =>
		`spartan-badge group/badge focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 inline-flex w-fit shrink-0 flex-row items-center justify-center overflow-hidden whitespace-nowrap focus-visible:ring-[3px] [&>ng-icon]:pointer-events-none spartan-badge-variant-${variant}`;
}
