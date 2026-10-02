import {
	Component,
	DestroyRef,
	ElementRef,
	NO_ERRORS_SCHEMA,
	computed,
	inject,
	signal,
	viewChild,
} from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';
import { bubbleClass, bubbleContentClass } from './bubble.demo';
import { messageClass, messageContentClass } from './message.demo';

interface ChatMessage {
	readonly id: string;
	readonly role: 'user' | 'assistant';
	readonly text: string;
}

interface NativeScroll {
	readonly android?: { scrollTo(x: number, y: number): void; computeVerticalScrollRange(): number };
	readonly ios?: {
		readonly contentSize: { readonly height: number };
		readonly bounds: { readonly size: { readonly height: number } };
		setContentOffsetAnimated(offset: { x: number; y: number }, animated: boolean): void;
	};
}

const SCRIPT: readonly ChatMessage[] = [
	{
		id: 'chat-1',
		role: 'user',
		text: "I'm building a chat and the scroll behavior is driving me nuts. Every time the AI streams a reply, the thread jumps around.",
	},
	{
		id: 'chat-2',
		role: 'assistant',
		text: "That's the classic streaming scroll problem. Wrap your message list in MessageScroller and turn on autoScroll: the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.",
	},
	{
		id: 'chat-3',
		role: 'user',
		text: "And if they've scrolled up to re-read an older answer? I don't want to yank them back down.",
	},
	{
		id: 'chat-4',
		role: 'assistant',
		text: "You won't. Auto-scroll only runs while the viewport is pinned to the bottom. When there is content they haven't seen yet, MessageScrollerButton appears. One tap jumps back to the newest message.",
	},
	{ id: 'chat-5', role: 'user', text: 'Does this work with assistive tech?' },
	{
		id: 'chat-6',
		role: 'assistant',
		text: 'MessageScrollerContent sets role="log" and aria-relevant="additions", so screen readers announce new messages as they stream in.',
	},
];

@Component({
	selector: 'message-scroller-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-4' },
	template: `
		<div class="h-96 overflow-hidden rounded-xl border">
			<div
				data-slot="message-scroller"
				class="group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden"
			>
				<div
					#viewport
					data-slot="message-scroller-viewport"
					class="scroll-fade-b size-full min-h-0 min-w-0 scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent"
				>
					<div
						data-slot="message-scroller-content"
						class="spartan-message-scroller-content flex h-max min-h-full flex-col p-4"
						[attr.aria-busy]="_streaming() ? 'true' : null"
					>
						@for (message of _messages(); track message.id) {
							<div
								data-slot="message-scroller-item"
								class="block min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]"
							>
								<div
									data-slot="message"
									[attr.data-align]="message.role === 'user' ? 'end' : 'start'"
									[class]="_message"
								>
									<div data-slot="message-content" [class]="_content">
										<div
											data-slot="bubble"
											[attr.data-variant]="message.role === 'user' ? 'muted' : 'ghost'"
											[class]="_bubble(message.role === 'user' ? 'muted' : 'ghost')"
										>
											<div data-slot="bubble-content" [class]="_bubbleContent">
												<p>{{ message.text }}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						} @empty {
							<p class="text-muted-foreground text-center text-sm">Press send to start the conversation.</p>
						}
					</div>
				</div>
				<button
					data-slot="message-scroller-button"
					data-direction="end"
					[attr.data-active]="_unseen() ? 'true' : 'false'"
					[class]="_scrollButton"
					(click)="jumpToEnd()"
				>
					<ui-icon name="lucideArrowDown" />
				</button>
			</div>
		</div>
		<div class="flex flex-row items-center gap-2">
			<p class="text-muted-foreground min-w-0 flex-1 text-xs">{{ _next()?.text ?? 'No messages queued.' }}</p>
			<button [class]="_btn('outline')" (click)="reset()"><ui-icon name="lucideRotateCw" /></button>
			<button [class]="_btn('default')" [attr.data-disabled]="!_next() || _streaming() ? '' : null" (click)="send()">
				<ui-icon name="lucideArrowUp" />
			</button>
		</div>
		<div class="flex flex-row items-center gap-2" (click)="_autoScroll.set(!_autoScroll())">
			<div
				data-slot="switch"
				data-size="default"
				class="spartan-switch group/switch inline-flex shrink-0 flex-row items-center"
				[attr.data-state]="_autoScroll() ? 'checked' : 'unchecked'"
			>
				<div
					data-slot="switch-thumb"
					class="spartan-switch-thumb block"
					[attr.data-state]="_autoScroll() ? 'checked' : 'unchecked'"
				></div>
			</div>
			<span class="text-sm font-medium">Auto-scroll</span>
		</div>
	`,
})
export default class MessageScrollerDemo {
	private readonly _viewport = viewChild.required<ElementRef<NativeScroll>>('viewport');
	private readonly _cursor = signal(0);
	private _timer?: ReturnType<typeof setInterval>;

	constructor() {
		inject(DestroyRef).onDestroy(() => clearInterval(this._timer));
	}

	protected readonly _messages = signal<readonly ChatMessage[]>([]);
	protected readonly _streaming = signal(false);
	protected readonly _autoScroll = signal(true);
	protected readonly _unseen = signal(false);
	protected readonly _next = computed<ChatMessage | undefined>(() => SCRIPT[this._cursor()]);

	protected readonly _message = messageClass;
	protected readonly _content = messageContentClass;
	protected readonly _bubble = bubbleClass;
	protected readonly _bubbleContent = bubbleContentClass;
	protected readonly _scrollButton = `${buttonVariants({ variant: 'secondary', size: 'icon-sm' })} absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full`;
	protected readonly _btn = (variant: 'default' | 'outline') => buttonVariants({ variant, size: 'icon-sm' });

	protected send() {
		const user = this._next();
		if (!user || this._streaming()) return;
		this.append(user);
		const reply: ChatMessage | undefined = SCRIPT[this._cursor() + 1];
		this._cursor.update((cursor) => cursor + (reply ? 2 : 1));
		if (!reply) return;
		this._streaming.set(true);
		this.append({ ...reply, text: '' });
		let length = 0;
		this._timer = setInterval(() => {
			length += 4;
			this._messages.update((messages) =>
				messages.map((message) =>
					message.id === reply.id ? { ...message, text: reply.text.slice(0, length) } : message,
				),
			);
			this.follow();
			if (length >= reply.text.length) this.stop();
		}, 30);
	}

	protected reset() {
		this.stop();
		this._cursor.set(0);
		this._messages.set([]);
		this._unseen.set(false);
	}

	protected jumpToEnd() {
		this._unseen.set(false);
		this.scrollToEnd();
	}

	private append(message: ChatMessage) {
		this._messages.update((messages) => [...messages, message]);
		this.follow();
	}

	private follow() {
		if (this._autoScroll()) this.scrollToEnd();
		else this._unseen.set(true);
	}

	private stop() {
		clearInterval(this._timer);
		this._streaming.set(false);
	}

	private scrollToEnd() {
		setTimeout(() => {
			const { android, ios } = this._viewport().nativeElement;
			android?.scrollTo(0, android.computeVerticalScrollRange());
			if (ios) {
				const y = Math.max(0, ios.contentSize.height - ios.bounds.size.height);
				ios.setContentOffsetAnimated({ x: 0, y }, true);
			}
		}, 50);
	}
}
