import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
	selector: 'avatar-demo',
	imports: [HlmAvatarImports],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Sizes</h3>
			<div class="flex flex-row flex-wrap items-center gap-4">
				@for (size of _sizes; track size) {
					<hlm-avatar [size]="size">
						<img hlmAvatarImage [src]="_src" alt="@spartan-ng" />
						<div hlmAvatarFallback>RG</div>
					</hlm-avatar>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Fallback</h3>
			<div class="flex flex-row flex-wrap items-center gap-4">
				@for (size of _sizes; track size) {
					<hlm-avatar [size]="size">
						<div hlmAvatarFallback>RG</div>
					</hlm-avatar>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Badge</h3>
			<div class="flex flex-row flex-wrap items-center gap-4">
				@for (size of _sizes; track size) {
					<hlm-avatar [size]="size">
						<img hlmAvatarImage [src]="_src" alt="@spartan-ng" />
						<div hlmAvatarFallback>RG</div>
						<div hlmAvatarBadge class="bg-red-600"></div>
					</hlm-avatar>
				}
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Group</h3>
			<div hlmAvatarGroup>
				<hlm-avatar>
					<img hlmAvatarImage [src]="_src" alt="@spartan-ng" />
					<div hlmAvatarFallback>RG</div>
				</hlm-avatar>
				<hlm-avatar>
					<div hlmAvatarFallback>CN</div>
				</hlm-avatar>
				<hlm-avatar>
					<div hlmAvatarFallback>ER</div>
				</hlm-avatar>
				<div hlmAvatarGroupCount>+3</div>
			</div>
		</section>
	`,
})
export default class AvatarDemo {
	protected readonly _sizes = ['sm', 'default', 'lg'] as const;
	protected readonly _src = 'https://github.com/spartan-ng.png';
}
