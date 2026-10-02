import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { type ButtonVariants, buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

@Component({
	selector: 'empty-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			<div data-slot="empty" [class]="_empty">
				<div data-slot="empty-header" [class]="_header">
					<div data-slot="empty-media" data-variant="icon" [class]="_media + ' spartan-empty-media-icon'">
						<ui-icon [name]="_created() ? 'lucideFolderCheck' : 'lucideFolderCode'" class="text-2xl" />
					</div>
					<p data-slot="empty-title" class="spartan-empty-title">
						{{ _created() ? 'Project Created' : 'No Projects Yet' }}
					</p>
					<p data-slot="empty-description" [class]="_description">
						{{
							_created()
								? 'Your first project is ready. Tap again to reset.'
								: "You haven't created any projects yet. Get started by creating your first project."
						}}
					</p>
				</div>
				<div data-slot="empty-content" [class]="_content + ' flex-row justify-center gap-2'">
					<button [class]="_btn({})" (click)="_created.set(!_created())">Create Project</button>
					<button [class]="_btn({ variant: 'outline' })">Import Project</button>
				</div>
				<button [class]="_btn({ variant: 'link', size: 'sm' }) + ' text-muted-foreground'">
					<span>Learn More</span>
					<ui-icon name="lucideArrowUpRight" />
				</button>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Outline</h3>
			<div data-slot="empty" [class]="_empty + ' border border-dashed'">
				<div data-slot="empty-header" [class]="_header">
					<div data-slot="empty-media" data-variant="icon" [class]="_media + ' spartan-empty-media-icon'">
						<ui-icon name="lucideCloud" class="text-2xl" />
					</div>
					<p data-slot="empty-title" class="spartan-empty-title">Cloud Storage Empty</p>
					<p data-slot="empty-description" [class]="_description">
						Upload files to your cloud storage to access them anywhere.
					</p>
				</div>
				<div data-slot="empty-content" [class]="_content">
					<button [class]="_btn({ variant: 'outline', size: 'sm' })">Upload Files</button>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Avatar</h3>
			<div data-slot="empty" [class]="_empty + ' bg-muted/50'">
				<div data-slot="empty-header" [class]="_header">
					<div data-slot="empty-media" data-variant="default" [class]="_media + ' spartan-empty-media-default'">
						<div
							data-slot="avatar"
							data-size="lg"
							class="spartan-avatar group/avatar relative flex size-12 shrink-0 select-none"
						>
							<span
								data-slot="avatar-fallback"
								class="spartan-avatar-fallback flex size-full items-center justify-center text-sm"
							>
								LR
							</span>
						</div>
					</div>
					<p data-slot="empty-title" class="spartan-empty-title">User Offline</p>
					<p data-slot="empty-description" [class]="_description">
						This user is currently offline. You can leave a message to notify them.
					</p>
				</div>
				<div data-slot="empty-content" [class]="_content">
					<button [class]="_btn({ size: 'sm' })">Leave Message</button>
				</div>
			</div>
		</section>
	`,
})
export default class EmptyDemo {
	protected readonly _created = signal(false);
	protected readonly _empty =
		'spartan-empty flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance';
	protected readonly _header = 'spartan-empty-header flex max-w-sm flex-col items-center';
	protected readonly _media =
		'spartan-empty-media flex shrink-0 items-center justify-center [&_ng-icon]:pointer-events-none [&_ng-icon]:shrink-0';
	protected readonly _description =
		'spartan-empty-description text-muted-foreground [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4';
	protected readonly _content = 'spartan-empty-content flex w-full max-w-sm min-w-0 flex-col items-center text-balance';
	protected readonly _btn = (variants: ButtonVariants) => buttonVariants(variants);
}
