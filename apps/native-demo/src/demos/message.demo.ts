import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports, type BubbleVariants } from '@spartan-ng/helm/bubble';
import { HlmMessageImports } from '@spartan-ng/helm/message';

export const messageClass =
	'spartan-message group/message relative flex w-full min-w-0 flex-row data-[align=end]:flex-row-reverse';
export const messageContentClass =
	'spartan-message-content flex w-full min-w-0 flex-col wrap-break-word group-data-[align=end]/message:*:data-slot:self-end';

interface Author {
	readonly initials: string;
	readonly src?: string;
}

interface Row {
	readonly id: string;
	readonly align: 'start' | 'end';
	readonly author?: Author;
	readonly variant: BubbleVariants['variant'];
	readonly bubbles: readonly { readonly id: string; readonly text: string }[];
	readonly header?: string;
	readonly footer?: string;
}

const me: Author = { initials: 'ME' };
const spartan: Author = { initials: 'R', src: 'https://github.com/spartan-ng.png' };

@Component({
	selector: 'message-demo',
	imports: [HlmAvatarImports, HlmBubbleImports, HlmMessageImports],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<p class="text-muted-foreground text-sm">Tap a bubble to react.</p>
		<div hlmMessageGroup>
			@for (row of _rows; track row.id) {
				<div hlmMessage [align]="row.align">
					@if (row.author; as author) {
						<div hlmMessageAvatar>
							<hlm-avatar>
								@if (author.src) {
									<img hlmAvatarImage class="grayscale" [src]="author.src" [alt]="author.initials" />
								}
								<div hlmAvatarFallback>{{ author.initials }}</div>
							</hlm-avatar>
						</div>
					}
					<div hlmMessageContent>
						@if (row.header) {
							<div hlmMessageHeader>
								<span>{{ row.header }}</span>
							</div>
						}
						<div hlmBubbleGroup>
							@for (item of row.bubbles; track item.id) {
								<div hlmBubble [variant]="row.variant" (click)="react(item.id)">
									<div hlmBubbleContent>
										<span>{{ item.text }}</span>
									</div>
									@if (_reacted()[item.id]) {
										<div hlmBubbleReactions>
											<span>👍</span>
										</div>
									}
								</div>
							}
						</div>
						@if (row.footer) {
							<div hlmMessageFooter>
								<span>{{ row.footer }}</span>
							</div>
						}
					</div>
				</div>
			}
		</div>
	`,
})
export default class MessageDemo {
	protected readonly _rows: readonly Row[] = [
		{
			id: 'header',
			align: 'start',
			variant: 'muted',
			header: 'Olivia',
			bubbles: [{ id: 'logs', text: 'I already checked the logs.' }],
		},
		{
			id: 'deploy',
			align: 'end',
			author: me,
			variant: 'default',
			bubbles: [{ id: 'prod', text: 'Deploying to prod real quick.' }],
		},
		{
			id: 'friday',
			align: 'start',
			author: spartan,
			variant: 'muted',
			bubbles: [{ id: 'time', text: "It's 4:55 PM. On a Friday." }],
		},
		{
			id: 'one-line',
			align: 'end',
			author: me,
			variant: 'default',
			bubbles: [{ id: 'change', text: "It's a one-line change." }],
			footer: 'Delivered',
		},
		{
			id: 'look',
			align: 'start',
			author: spartan,
			variant: 'muted',
			bubbles: [
				{ id: 'always', text: "It's always a one-line change." },
				{ id: 'alright', text: 'Alright, let me take a look.' },
			],
		},
	];
	protected readonly _reacted = signal<Record<string, boolean>>({ alright: true });

	protected react(id: string) {
		this._reacted.update((reacted) => ({ ...reacted, [id]: !reacted[id] }));
	}
}
