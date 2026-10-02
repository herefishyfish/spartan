import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideCloud, lucideFolderCheck, lucideFolderCode } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

@Component({
	selector: 'empty-demo',
	imports: [HlmEmptyImports, HlmAvatarImports, HlmButton, NgIcon],
	providers: [provideIcons({ lucideArrowUpRight, lucideCloud, lucideFolderCheck, lucideFolderCode })],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<!-- Icons carry text-2xl because spartan sizes them with [&_ng-icon:not([class*='text-'])], which does not match. -->
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Default</h3>
			<div hlmEmpty>
				<div hlmEmptyHeader>
					<div hlmEmptyMedia variant="icon">
						<ng-icon [name]="_created() ? 'lucideFolderCheck' : 'lucideFolderCode'" class="text-2xl" />
					</div>
					<p hlmEmptyTitle>{{ _created() ? 'Project Created' : 'No Projects Yet' }}</p>
					<p hlmEmptyDescription>
						{{
							_created()
								? 'Your first project is ready. Tap again to reset.'
								: "You haven't created any projects yet. Get started by creating your first project."
						}}
					</p>
				</div>
				<div hlmEmptyContent class="flex-row justify-center gap-2">
					<button hlmBtn (click)="_created.set(!_created())">Create Project</button>
					<button hlmBtn variant="outline">Import Project</button>
				</div>
				<button hlmBtn variant="link" size="sm" class="text-muted-foreground">
					<span>Learn More</span>
					<ng-icon name="lucideArrowUpRight" />
				</button>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Outline</h3>
			<div hlmEmpty class="border border-dashed">
				<div hlmEmptyHeader>
					<div hlmEmptyMedia variant="icon">
						<ng-icon name="lucideCloud" class="text-2xl" />
					</div>
					<p hlmEmptyTitle>Cloud Storage Empty</p>
					<p hlmEmptyDescription>Upload files to your cloud storage to access them anywhere.</p>
				</div>
				<div hlmEmptyContent>
					<button hlmBtn variant="outline" size="sm">Upload Files</button>
				</div>
			</div>
		</section>
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Avatar</h3>
			<div hlmEmpty class="bg-muted/50">
				<div hlmEmptyHeader>
					<div hlmEmptyMedia>
						<hlm-avatar size="lg" class="size-12">
							<span hlmAvatarFallback>LR</span>
						</hlm-avatar>
					</div>
					<p hlmEmptyTitle>User Offline</p>
					<p hlmEmptyDescription>This user is currently offline. You can leave a message to notify them.</p>
				</div>
				<div hlmEmptyContent>
					<button hlmBtn size="sm">Leave Message</button>
				</div>
			</div>
		</section>
	`,
})
export default class EmptyDemo {
	protected readonly _created = signal(false);
}
