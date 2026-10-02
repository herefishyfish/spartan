import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import type { ItemMediaVariants, ItemVariants } from '@spartan-ng/helm/item';
import { Icon } from '../ui/icon';

@Component({
	selector: 'item-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Variants</h3>
			<div data-slot="item-group" class="spartan-item-group group/item-group flex w-full flex-col">
				@for (variant of _variants; track variant) {
					<div data-slot="item" [attr.data-variant]="variant" data-size="default" [class]="item(variant, 'default')">
						<div data-slot="item-content" [class]="_content">
							<span data-slot="item-title" [class]="_title">{{ variant }} variant</span>
							<p data-slot="item-description" [class]="_description">A simple item with title and description.</p>
						</div>
						<div data-slot="item-actions" [class]="_actions">
							<button [class]="_outlineSm">Open</button>
						</div>
					</div>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Media</h3>
			<div data-slot="item" data-variant="outline" data-size="default" [class]="item('outline', 'default')">
				<div data-slot="item-media" data-variant="icon" [class]="media('icon')">
					<ui-icon name="lucideShieldAlert" class="text-base" />
				</div>
				<div data-slot="item-content" [class]="_content">
					<span data-slot="item-title" [class]="_title">Security Alert</span>
					<p data-slot="item-description" [class]="_description">New login detected from unknown device.</p>
				</div>
				<div data-slot="item-actions" [class]="_actions">
					<button [class]="_outlineSm" (click)="_reviewed.set(true)">{{ _reviewed() ? 'Reviewed' : 'Review' }}</button>
				</div>
			</div>
			<div data-slot="item" data-variant="outline" data-size="default" [class]="item('outline', 'default')">
				<div data-slot="item-media" data-variant="image" [class]="media('image')">
					<img src="https://github.com/spartan-ng.png" class="size-full object-cover" />
				</div>
				<div data-slot="item-content" [class]="_content">
					<span data-slot="item-title" [class]="_title">spartan-ng</span>
					<p data-slot="item-description" [class]="_description">Last seen 5 months ago</p>
				</div>
				<div data-slot="item-actions" [class]="_actions">
					<button [class]="_iconSm + ' rounded-full'"><ui-icon name="lucidePlus" /></button>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Sizes</h3>
			<div data-slot="item-group" class="spartan-item-group group/item-group flex w-full flex-col">
				@for (size of _sizes; track size.id) {
					<div data-slot="item" data-variant="outline" [attr.data-size]="size.id" [class]="item('outline', size.id)">
						<div data-slot="item-media" data-variant="icon" [class]="media('icon')">
							<ui-icon name="lucideInbox" class="text-base" />
						</div>
						<div data-slot="item-content" [class]="_content">
							<span data-slot="item-title" [class]="_title">{{ size.title }}</span>
							<p data-slot="item-description" [class]="_description">{{ size.body }}</p>
						</div>
					</div>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Pressable</h3>
			<div
				role="button"
				data-slot="item"
				data-variant="outline"
				data-size="sm"
				[class]="item('outline', 'sm')"
				(click)="_verified.set(!_verified())"
			>
				<div data-slot="item-media" data-variant="default" [class]="media('default')">
					<ui-icon [name]="_verified() ? 'lucideBadgeCheck' : 'lucideBadge'" class="text-xl" />
				</div>
				<div data-slot="item-content" [class]="_content">
					<span data-slot="item-title" [class]="_title">
						{{ _verified() ? 'Your profile has been verified.' : 'Tap to verify your profile.' }}
					</span>
				</div>
				<div data-slot="item-actions" [class]="_actions">
					<ui-icon name="lucideChevronRight" class="text-base" />
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
	protected readonly _content = 'spartan-item-content flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none';
	protected readonly _title = 'spartan-item-title line-clamp-1 flex w-fit flex-row items-center';
	protected readonly _description =
		'spartan-item-description [&>a:hover]:text-primary line-clamp-2 flex font-normal [&>a]:underline [&>a]:underline-offset-4';
	protected readonly _actions = 'spartan-item-actions flex flex-row items-center';
	protected readonly _outlineSm = buttonVariants({ variant: 'outline', size: 'sm' });
	protected readonly _iconSm = buttonVariants({ variant: 'outline', size: 'icon-sm' });

	protected item(variant: ItemVariants['variant'], size: ItemVariants['size']) {
		return `spartan-item group/item focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-row flex-wrap items-center transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors spartan-item-variant-${variant} spartan-item-size-${size}`;
	}

	protected media(variant: ItemMediaVariants['variant']) {
		return `spartan-item-media flex shrink-0 items-center justify-center [&_ng-icon]:pointer-events-none spartan-item-media-variant-${variant}`;
	}
}
