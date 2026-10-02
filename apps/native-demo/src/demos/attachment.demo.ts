import { Component, DestroyRef, NO_ERRORS_SCHEMA, inject, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import type { IconName } from '../ui/icon';
import { Icon } from '../ui/icon';

type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done';
type AttachmentSize = 'default' | 'sm' | 'xs';

interface Upload {
	readonly id: number;
	readonly name: string;
	readonly size: string;
	readonly state: AttachmentState;
	readonly progress: number;
	readonly fails?: boolean;
}

const sizeClass: Record<AttachmentSize, string> = {
	default:
		'spartan-attachment-size-default gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2',
	sm: 'spartan-attachment-size-sm gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5',
	xs: 'spartan-attachment-size-xs gap-1.5 text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1',
};

const attachmentClass = (size: AttachmentSize, orientation: 'horizontal' | 'vertical') =>
	[
		'spartan-attachment group/attachment focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap transition-colors focus-within:ring-1 data-[state=idle]:border-dashed',
		sizeClass[size],
		orientation === 'horizontal'
			? 'spartan-attachment-orientation-horizontal min-w-40 flex-row items-center'
			: 'spartan-attachment-orientation-vertical w-24 flex-col has-data-[slot=attachment-content]:w-30',
	].join(' ');

const mediaClass = (variant: 'icon' | 'image') =>
	[
		"spartan-attachment-media group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive relative flex aspect-square shrink-0 items-center justify-center overflow-hidden group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 [&_ng-icon]:pointer-events-none [&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] group-data-[orientation=vertical]/attachment:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(6)] group-data-[size=xs]/attachment:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(3.5)]",
		variant === 'icon'
			? 'spartan-attachment-media-variant-icon'
			: 'spartan-attachment-media-variant-image *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover',
	].join(' ');

const stateIcon: Record<AttachmentState, IconName> = {
	idle: 'lucideClock',
	uploading: 'lucideLoaderCircle',
	processing: 'lucideFileText',
	error: 'lucideFileWarning',
	done: 'lucideCheck',
};

@Component({
	selector: 'attachment-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Images</h3>
			<div
				data-slot="attachment-group"
				class="spartan-attachment-group scroll-fade-x no-scrollbar flex min-w-0 snap-x snap-mandatory scroll-px-1 flex-row gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start"
			>
				@for (image of _images; track image.name) {
					<div
						data-slot="attachment"
						data-state="done"
						data-size="default"
						data-orientation="vertical"
						[class]="_attachment('default', 'vertical')"
					>
						<div data-slot="attachment-media" data-variant="image" [class]="_media('image')">
							<img [src]="image.src" />
						</div>
						<div
							data-slot="attachment-content"
							class="spartan-attachment-content max-w-full group-data-[orientation=vertical]/attachment:px-1"
						>
							<span data-slot="attachment-title" [class]="_title">{{ image.name }}</span>
							<span data-slot="attachment-description" [class]="_description">{{ image.meta }}</span>
						</div>
					</div>
				}
			</div>
		</section>

		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Uploads</h3>
			@for (upload of _uploads(); track upload.id) {
				<div
					data-slot="attachment"
					data-size="default"
					data-orientation="horizontal"
					[attr.data-state]="upload.state"
					[class]="_attachment('default', 'horizontal') + ' w-full'"
				>
					<div data-slot="attachment-media" data-variant="icon" [class]="_media('icon')">
						<ui-icon [name]="_icon[upload.state]" [class]="upload.state === 'uploading' ? 'animate-spin' : ''" />
					</div>
					<div
						data-slot="attachment-content"
						class="spartan-attachment-content max-w-full group-data-[orientation=vertical]/attachment:px-1"
					>
						<span data-slot="attachment-title" [class]="_title">{{ upload.name }}</span>
						<span data-slot="attachment-description" [class]="_description">{{ describe(upload) }}</span>
					</div>
					<div
						data-slot="attachment-actions"
						class="spartan-attachment-actions relative z-20 flex flex-row group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:end-3 group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:gap-1"
					>
						@if (upload.state === 'error' || upload.state === 'idle') {
							<button data-slot="attachment-action" [class]="_action" (click)="start(upload.id)">
								<ui-icon [name]="upload.state === 'error' ? 'lucideRefreshCw' : 'lucideUpload'" />
							</button>
						}
						<button data-slot="attachment-action" [class]="_action" (click)="remove(upload.id)">
							<ui-icon name="lucideX" />
						</button>
					</div>
				</div>
			}
			<button [class]="_addButton" (click)="add()">
				<ui-icon name="lucidePaperclip" />
				<span>Add file</span>
			</button>
		</section>

		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Sizes</h3>
			@for (size of _sizes; track size) {
				<div
					data-slot="attachment"
					data-state="done"
					data-orientation="horizontal"
					[attr.data-size]="size"
					[class]="_attachment(size, 'horizontal') + ' w-full'"
				>
					<div data-slot="attachment-media" data-variant="icon" [class]="_media('icon')">
						<ui-icon name="lucideFileText" />
					</div>
					<div
						data-slot="attachment-content"
						class="spartan-attachment-content max-w-full group-data-[orientation=vertical]/attachment:px-1"
					>
						<span data-slot="attachment-title" [class]="_title">{{ size }} attachment</span>
						@if (size !== 'xs') {
							<span data-slot="attachment-description" [class]="_description">PDF · 2.4 MB</span>
						}
					</div>
				</div>
			}
		</section>
	`,
})
export default class AttachmentDemo {
	private readonly _timers = new Map<number, ReturnType<typeof setInterval>>();
	private _nextId = 4;

	protected readonly _images = [
		{
			name: 'workspace.png',
			meta: 'PNG · 820 KB',
			src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&auto=format&fit=crop&q=80',
		},
		{
			name: 'desk-reference.jpg',
			meta: 'JPG · 1.1 MB',
			src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&auto=format&fit=crop&q=80',
		},
		{
			name: 'office-reference.jpg',
			meta: 'JPG · 940 KB',
			src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&auto=format&fit=crop&q=80',
		},
	];
	protected readonly _uploads = signal<readonly Upload[]>([
		{ id: 1, name: 'selected-file.pdf', size: '640 KB', state: 'idle', progress: 0 },
		{ id: 2, name: 'financial-model.xlsx', size: '2.1 MB', state: 'error', progress: 0 },
		{ id: 3, name: 'uploaded-report.pdf', size: '1.8 MB', state: 'done', progress: 100 },
	]);
	protected readonly _sizes: readonly AttachmentSize[] = ['default', 'sm', 'xs'];
	protected readonly _icon = stateIcon;
	protected readonly _attachment = attachmentClass;
	protected readonly _media = mediaClass;
	protected readonly _title =
		'spartan-attachment-title group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer block max-w-full min-w-0';
	protected readonly _description =
		'spartan-attachment-description group-data-[state=error]/attachment:text-destructive/80 block max-w-full min-w-0';
	protected readonly _action = buttonVariants({ variant: 'ghost', size: 'icon-xs' });
	protected readonly _addButton = buttonVariants({ variant: 'outline' });

	constructor() {
		inject(DestroyRef).onDestroy(() => this._timers.forEach((timer) => clearInterval(timer)));
	}

	protected describe(upload: Upload) {
		switch (upload.state) {
			case 'idle':
				return 'Ready to upload';
			case 'uploading':
				return `Uploading · ${upload.progress}%`;
			case 'processing':
				return 'Processing document';
			case 'error':
				return 'Upload failed. Try again.';
			case 'done':
				return `Uploaded · ${upload.size}`;
		}
	}

	protected add() {
		const id = this._nextId++;
		this._uploads.update((uploads) => [
			...uploads,
			{ id, name: `design-system-${id}.zip`, size: '3.2 MB', state: 'idle', progress: 0, fails: id % 2 === 1 },
		]);
		this.start(id);
	}

	protected start(id: number) {
		this.patch(id, { state: 'uploading', progress: 0 });
		const timer = setInterval(() => {
			const upload = this._uploads().find((item) => item.id === id);
			if (!upload) return this.clear(id);
			if (upload.fails && upload.progress >= 60) {
				this.clear(id);
				return this.patch(id, { state: 'error', fails: false });
			}
			if (upload.progress < 100)
				return this.patch(id, { progress: upload.progress + 8 > 100 ? 100 : upload.progress + 8 });
			this.clear(id);
			this.patch(id, { state: 'processing' });
			setTimeout(() => this.patch(id, { state: 'done' }), 1200);
		}, 150);
		this._timers.set(id, timer);
	}

	protected remove(id: number) {
		this.clear(id);
		this._uploads.update((uploads) => uploads.filter((upload) => upload.id !== id));
	}

	private patch(id: number, changes: Partial<Upload>) {
		this._uploads.update((uploads) => uploads.map((upload) => (upload.id === id ? { ...upload, ...changes } : upload)));
	}

	private clear(id: number) {
		clearInterval(this._timers.get(id));
		this._timers.delete(id);
	}
}
