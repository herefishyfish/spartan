import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import {
	bubbleClass,
	bubbleContentClass,
	bubbleGroupClass,
	bubbleReactionsClass,
	type BubbleVariant,
} from './bubble.demo';

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
	readonly variant: BubbleVariant;
	readonly bubbles: readonly { readonly id: string; readonly text: string }[];
	readonly header?: string;
	readonly footer?: string;
}

const me: Author = { initials: 'ME' };
const spartan: Author = { initials: 'R', src: 'https://github.com/spartan-ng.png' };

@Component({
	selector: 'message-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<p class="text-muted-foreground text-sm">Tap a bubble to react.</p>
		<div data-slot="message-group" class="spartan-message-group flex min-w-0 flex-col">
			@for (row of _rows; track row.id) {
				<div data-slot="message" [attr.data-align]="row.align" [class]="_message">
					@if (row.author; as author) {
						<div
							data-slot="message-avatar"
							class="spartan-message-avatar flex w-fit shrink-0 items-center justify-center self-end overflow-hidden group-has-data-[slot=message-footer]/message:-translate-y-8"
						>
							<div
								data-slot="avatar"
								data-size="default"
								class="spartan-avatar group/avatar after:border-border relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten"
							>
								@if (author.src) {
									<img
										data-slot="avatar-image"
										class="spartan-avatar-image aspect-square size-full object-cover grayscale"
										[src]="author.src"
									/>
								} @else {
									<div
										data-slot="avatar-fallback"
										class="spartan-avatar-fallback flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs"
									>
										<span>{{ author.initials }}</span>
									</div>
								}
							</div>
						</div>
					}
					<div data-slot="message-content" [class]="_content">
						@if (row.header) {
							<div
								data-slot="message-header"
								class="spartan-message-header flex max-w-full min-w-0 flex-row items-center group-has-data-[variant=ghost]/message:px-0"
							>
								<span>{{ row.header }}</span>
							</div>
						}
						<div data-slot="bubble-group" [class]="_group">
							@for (item of row.bubbles; track item.id) {
								<div
									data-slot="bubble"
									[attr.data-variant]="row.variant"
									[class]="_bubble(row.variant)"
									(click)="react(item.id)"
								>
									<div data-slot="bubble-content" [class]="_bubbleContent">
										<span>{{ item.text }}</span>
									</div>
									@if (_reacted()[item.id]) {
										<div data-slot="bubble-reactions" data-side="bottom" data-align="end" [class]="_reactions()">
											<span>👍</span>
										</div>
									}
								</div>
							}
						</div>
						@if (row.footer) {
							<div
								data-slot="message-footer"
								class="spartan-message-footer flex max-w-full min-w-0 flex-row items-center group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end"
							>
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
	protected readonly _message = messageClass;
	protected readonly _content = messageContentClass;
	protected readonly _group = bubbleGroupClass;
	protected readonly _bubble = bubbleClass;
	protected readonly _bubbleContent = bubbleContentClass;
	protected readonly _reactions = bubbleReactionsClass;

	protected react(id: string) {
		this._reacted.update((reacted) => ({ ...reacted, [id]: !reacted[id] }));
	}
}
