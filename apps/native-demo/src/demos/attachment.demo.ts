import { Component, DestroyRef, NO_ERRORS_SCHEMA, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCheck,
	lucideClock,
	lucideFileText,
	lucideFileWarning,
	lucidePaperclip,
	lucideRefreshCw,
	lucideUpload,
	lucideX,
} from '@ng-icons/lucide';
import { type AttachmentState, HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

interface Upload {
	readonly id: number;
	readonly name: string;
	readonly size: string;
	readonly state: AttachmentState;
	readonly progress: number;
	readonly fails?: boolean;
}

const stateIcon: Record<Exclude<AttachmentState, 'uploading'>, string> = {
	idle: 'lucideClock',
	processing: 'lucideFileText',
	error: 'lucideFileWarning',
	done: 'lucideCheck',
};

@Component({
	selector: 'attachment-demo',
	imports: [HlmAttachmentImports, HlmButton, HlmSpinner, NgIcon],
	schemas: [NO_ERRORS_SCHEMA],
	providers: [
		provideIcons({
			lucideCheck,
			lucideClock,
			lucideFileText,
			lucideFileWarning,
			lucidePaperclip,
			lucideRefreshCw,
			lucideUpload,
			lucideX,
		}),
	],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Images</h3>
			<div hlmAttachmentGroup>
				@for (image of _images; track image.name) {
					<div hlmAttachment orientation="vertical">
						<div hlmAttachmentMedia variant="image">
							<img [src]="image.src" />
						</div>
						<div hlmAttachmentContent>
							<span hlmAttachmentTitle>{{ image.name }}</span>
							<span hlmAttachmentDescription>{{ image.meta }}</span>
						</div>
					</div>
				}
			</div>
		</section>

		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Uploads</h3>
			@for (upload of _uploads(); track upload.id) {
				<div hlmAttachment [state]="upload.state" class="w-full">
					<div hlmAttachmentMedia>
						@if (upload.state === 'uploading') {
							<hlm-spinner />
						} @else {
							<ng-icon [name]="_icon[upload.state]" />
						}
					</div>
					<div hlmAttachmentContent>
						<span hlmAttachmentTitle>{{ upload.name }}</span>
						<span hlmAttachmentDescription>{{ describe(upload) }}</span>
					</div>
					<div hlmAttachmentActions>
						@if (upload.state === 'error' || upload.state === 'idle') {
							<button hlmAttachmentAction (click)="start(upload.id)">
								<ng-icon [name]="upload.state === 'error' ? 'lucideRefreshCw' : 'lucideUpload'" />
							</button>
						}
						<button hlmAttachmentAction (click)="remove(upload.id)">
							<ng-icon name="lucideX" />
						</button>
					</div>
				</div>
			}
			<button hlmBtn variant="outline" (click)="add()">
				<ng-icon name="lucidePaperclip" />
				<span>Add file</span>
			</button>
		</section>

		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Sizes</h3>
			@for (size of _sizes; track size) {
				<div hlmAttachment [size]="size" class="w-full">
					<div hlmAttachmentMedia>
						<ng-icon name="lucideFileText" />
					</div>
					<div hlmAttachmentContent>
						<span hlmAttachmentTitle>{{ size }} attachment</span>
						@if (size !== 'xs') {
							<span hlmAttachmentDescription>PDF · 2.4 MB</span>
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
	protected readonly _sizes = ['default', 'sm', 'xs'] as const;
	protected readonly _icon = stateIcon;

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
