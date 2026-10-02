import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideBadge,
	lucideBadgeCheck,
	lucideChevronRight,
	lucideInbox,
	lucidePlus,
	lucideShieldAlert,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'item-demo',
	imports: [HlmItemImports, HlmButton, NgIcon],
	providers: [
		provideIcons({
			lucideBadge,
			lucideBadgeCheck,
			lucideChevronRight,
			lucideInbox,
			lucidePlus,
			lucideShieldAlert,
		}),
	],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Variants</h3>
			<div hlmItemGroup>
				@for (variant of _variants; track variant) {
					<div hlmItem [variant]="variant">
						<div hlmItemContent>
							<div hlmItemTitle>{{ variant }} variant</div>
							<p hlmItemDescription>A simple item with title and description.</p>
						</div>
						<div hlmItemActions>
							<button hlmBtn variant="outline" size="sm">Open</button>
						</div>
					</div>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Media</h3>
			<div hlmItem variant="outline">
				<div hlmItemMedia variant="icon">
					<ng-icon name="lucideShieldAlert" class="text-base" />
				</div>
				<div hlmItemContent>
					<div hlmItemTitle>Security Alert</div>
					<p hlmItemDescription>New login detected from unknown device.</p>
				</div>
				<div hlmItemActions>
					<button hlmBtn variant="outline" size="sm" (click)="_reviewed.set(true)">
						{{ _reviewed() ? 'Reviewed' : 'Review' }}
					</button>
				</div>
			</div>
			<div hlmItem variant="outline">
				<div hlmItemMedia variant="image">
					<img src="https://github.com/spartan-ng.png" class="size-full object-cover" />
				</div>
				<div hlmItemContent>
					<div hlmItemTitle>spartan-ng</div>
					<p hlmItemDescription>Last seen 5 months ago</p>
				</div>
				<div hlmItemActions>
					<button hlmBtn variant="outline" size="icon-sm" class="rounded-full" aria-label="Add">
						<ng-icon name="lucidePlus" />
					</button>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Sizes</h3>
			<div hlmItemGroup>
				@for (size of _sizes; track size.id) {
					<div hlmItem variant="outline" [size]="size.id">
						<div hlmItemMedia variant="icon">
							<ng-icon name="lucideInbox" class="text-base" />
						</div>
						<div hlmItemContent>
							<div hlmItemTitle>{{ size.title }}</div>
							<p hlmItemDescription>{{ size.body }}</p>
						</div>
					</div>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Pressable</h3>
			<div hlmItem variant="outline" size="sm" role="button" (click)="_verified.set(!_verified())">
				<div hlmItemMedia>
					<ng-icon [name]="_verified() ? 'lucideBadgeCheck' : 'lucideBadge'" class="text-xl" />
				</div>
				<div hlmItemContent>
					<div hlmItemTitle>
						{{ _verified() ? 'Your profile has been verified.' : 'Tap to verify your profile.' }}
					</div>
				</div>
				<div hlmItemActions>
					<ng-icon name="lucideChevronRight" class="text-base" />
				</div>
			</div>
		</section>
	`,
})
export default class ItemDemo {
	protected readonly _variants = ['default', 'outline', 'muted'] as const;
	protected readonly _sizes = [
		{ id: 'default', title: 'Default Size', body: 'The standard size for most use cases.' },
		{ id: 'sm', title: 'Small Size', body: 'A compact size for dense layouts.' },
		{ id: 'xs', title: 'Extra Small Size', body: 'The most compact size available.' },
	] as const;
	protected readonly _reviewed = signal(false);
	protected readonly _verified = signal(false);
}
