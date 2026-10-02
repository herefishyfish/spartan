import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
	selector: 'avatar-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Sizes</h3>
			<div class="flex flex-row flex-wrap items-center gap-4">
				@for (size of _sizes; track size) {
					<div data-slot="avatar" [attr.data-size]="size" [class]="_avatar">
						<img data-slot="avatar-image" [class]="_image" [src]="_src" />
					</div>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Fallback</h3>
			<div class="flex flex-row flex-wrap items-center gap-4">
				@for (size of _sizes; track size) {
					<div data-slot="avatar" [attr.data-size]="size" [class]="_avatar">
						<span data-slot="avatar-fallback" [class]="_fallback">RG</span>
					</div>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Badge</h3>
			<div class="flex flex-row flex-wrap items-center gap-4">
				@for (size of _sizes; track size) {
					<div data-slot="avatar" [attr.data-size]="size" [class]="_avatar">
						<img data-slot="avatar-image" [class]="_image" [src]="_src" />
						<div data-slot="avatar-badge" [class]="_badge"></div>
					</div>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Group</h3>
			<div
				data-slot="avatar-group"
				class="*:data-[slot=avatar]:ring-background group/avatar-group flex flex-row -space-x-2 *:data-[slot=avatar]:ring-2"
			>
				<div data-slot="avatar" data-size="default" [class]="_avatar">
					<img data-slot="avatar-image" [class]="_image" [src]="_src" />
				</div>
				<div data-slot="avatar" data-size="default" [class]="_avatar">
					<span data-slot="avatar-fallback" [class]="_fallback">CN</span>
				</div>
				<div data-slot="avatar" data-size="default" [class]="_avatar">
					<span data-slot="avatar-fallback" [class]="_fallback">ER</span>
				</div>
				<span data-slot="avatar-group-count" [class]="_count">+3</span>
			</div>
		</section>
	`,
})
export default class AvatarDemo {
	protected readonly _sizes = ['sm', 'default', 'lg'] as const;
	protected readonly _src = 'https://github.com/spartan-ng.png';
	protected readonly _avatar =
		'spartan-avatar group/avatar after:border-border relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten';
	protected readonly _image = 'spartan-avatar-image aspect-square size-full object-cover';
	protected readonly _fallback =
		'spartan-avatar-fallback flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs';
	protected readonly _badge = [
		'spartan-avatar-badge absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none bg-red-600',
		'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>ng-icon]:hidden',
		'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>ng-icon]:text-[length:--spacing(2)]',
		'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>ng-icon]:text-[length:--spacing(2)]',
	].join(' ');
	protected readonly _count =
		'bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>ng-icon]:text-base group-has-data-[size=lg]/avatar-group:[&>ng-icon]:text-xl group-has-data-[size=sm]/avatar-group:[&>ng-icon]:text-xs';
}
