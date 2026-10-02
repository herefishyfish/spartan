import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBookmark, lucideCheck, lucidePlus } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'badge-demo',
	imports: [HlmBadge, HlmSpinner, NgIcon],
	providers: [provideIcons({ lucideBadgeCheck, lucideBookmark, lucideCheck, lucidePlus })],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Variants</h3>
			<div class="flex flex-row flex-wrap gap-2">
				@for (variant of _variants; track variant) {
					<div hlmBadge [variant]="variant">{{ variant }}</div>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With icons</h3>
			<div class="flex flex-row flex-wrap gap-2">
				<div hlmBadge variant="secondary">
					<ng-icon name="lucideBadgeCheck" data-icon="inline-start" />
					<span>Verified</span>
				</div>
				<div hlmBadge variant="outline">
					<span>Bookmark</span>
					<ng-icon name="lucideBookmark" data-icon="inline-end" />
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">With spinner</h3>
			<div class="flex flex-row flex-wrap gap-2">
				<div hlmBadge variant="destructive">
					<hlm-spinner class="text-xs" />
					<span>Deleting</span>
				</div>
				<div hlmBadge variant="outline">
					<span>Syncing</span>
					<hlm-spinner class="text-xs" />
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Pressable</h3>
			<div class="flex flex-row flex-wrap gap-2">
				<div hlmBadge [variant]="_following() ? 'default' : 'outline'" (click)="_following.set(!_following())">
					<ng-icon [name]="_following() ? 'lucideCheck' : 'lucidePlus'" />
					<span>{{ _following() ? 'Following' : 'Follow' }}</span>
				</div>
			</div>
		</section>
	`,
})
export default class BadgeDemo {
	protected readonly _variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const;
	protected readonly _following = signal(false);
}
