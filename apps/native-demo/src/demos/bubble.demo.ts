import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';

export type BubbleVariant = 'default' | 'secondary' | 'muted' | 'tinted' | 'outline' | 'ghost' | 'destructive';

export const bubbleClass = (variant: BubbleVariant = 'default') =>
	`spartan-bubble group/bubble relative flex w-fit min-w-0 flex-col group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full spartan-bubble-variant-${variant}`;

export const bubbleContentClass =
	'spartan-bubble-content [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-ring/50 w-fit max-w-full min-w-0 overflow-hidden border border-transparent wrap-break-word group-data-[align=end]/bubble:self-end [button]:text-start [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:ring-3';

export const bubbleGroupClass = 'spartan-bubble-group flex min-w-0 flex-col';

export const bubbleReactionsClass = (side: 'top' | 'bottom' = 'bottom', align: 'start' | 'end' = 'end') =>
	[
		'spartan-bubble-reactions absolute z-10 flex w-fit shrink-0 flex-row items-center justify-center has-[button]:p-0',
		side === 'top' ? 'top-0 -translate-y-3/4' : 'bottom-0 translate-y-3/4',
		align === 'start' ? 'start-3' : 'end-3',
	].join(' ');

@Component({
	selector: 'bubble-demo',
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Variants</h3>
			<div class="flex flex-row flex-wrap gap-2">
				@for (option of _variants; track option) {
					<button [class]="_btn(option === _variant() ? 'default' : 'outline')" (click)="_variant.set(option)">
						{{ option }}
					</button>
				}
			</div>
			<div class="flex flex-col gap-4">
				<div data-slot="bubble" data-align="end" [attr.data-variant]="_variant()" [class]="_bubble(_variant())">
					<div data-slot="bubble-content" [class]="_content">
						<span>This is the {{ _variant() }} variant.</span>
					</div>
				</div>
				<div data-slot="bubble" data-align="start" [attr.data-variant]="_variant()" [class]="_bubble(_variant())">
					<div data-slot="bubble-content" [class]="_content">
						<span>Tap a variant above to restyle both bubbles.</span>
					</div>
				</div>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Group and reactions</h3>
			<div class="flex flex-col gap-4">
				<div data-slot="bubble" data-align="end" data-variant="default" [class]="_bubble('default')">
					<div data-slot="bubble-content" [class]="_content"><span>Hey there! what's up?</span></div>
				</div>
				<div data-slot="bubble-group" [class]="_group">
					<div data-slot="bubble" data-align="start" data-variant="muted" [class]="_bubble('muted')">
						<div data-slot="bubble-content" [class]="_content"><span>Hey! Want to see chat bubbles?</span></div>
					</div>
					<div
						data-slot="bubble"
						data-align="start"
						data-variant="muted"
						[class]="_bubble('muted')"
						(click)="_liked.set(!_liked())"
					>
						<div data-slot="bubble-content" [class]="_content">
							<span>I can group messages, switch sides, and keep the whole thread easy to scan. Tap me.</span>
						</div>
						@if (_liked()) {
							<div data-slot="bubble-reactions" data-side="bottom" data-align="end" [class]="_reactions()">
								<span>👍</span>
							</div>
						}
					</div>
				</div>
				<div data-slot="bubble" data-align="end" data-variant="default" [class]="_bubble('default')">
					<div data-slot="bubble-content" [class]="_content">
						<span>Tests passed on the first try. All 142 of them.</span>
					</div>
					<div data-slot="bubble-reactions" data-side="top" data-align="start" [class]="_reactions('top', 'start')">
						<span>🎉</span>
						<span>👏</span>
					</div>
				</div>
				<div data-slot="bubble" data-align="start" data-variant="destructive" [class]="_bubble('destructive')">
					<div data-slot="bubble-content" [class]="_content">
						<span>{{ _ran() ? 'Command finished.' : 'Are you sure I can run this command?' }}</span>
					</div>
					@if (!_ran()) {
						<div data-slot="bubble-reactions" data-side="bottom" data-align="end" [class]="_reactions()">
							<button [class]="_btn('ghost', 'xs')" (click)="_ran.set(true)">Yes, run it</button>
						</div>
					}
				</div>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Ghost</h3>
			<div data-slot="bubble" data-align="start" data-variant="ghost" [class]="_bubble('ghost')">
				<div data-slot="bubble-content" [class]="_content + ' flex flex-col gap-4'">
					<p>Ghost bubbles work for assistant text and other content that should not be framed.</p>
					<p>They take the full width of the container.</p>
				</div>
			</div>
		</section>
	`,
})
export default class BubbleDemo {
	protected readonly _variants: readonly BubbleVariant[] = [
		'default',
		'secondary',
		'muted',
		'tinted',
		'outline',
		'ghost',
		'destructive',
	];
	protected readonly _variant = signal<BubbleVariant>('muted');
	protected readonly _liked = signal(true);
	protected readonly _ran = signal(false);
	protected readonly _bubble = bubbleClass;
	protected readonly _content = bubbleContentClass;
	protected readonly _group = bubbleGroupClass;
	protected readonly _reactions = bubbleReactionsClass;
	protected readonly _btn = (variant: 'default' | 'outline' | 'ghost', size: 'xs' | 'sm' = 'sm') =>
		buttonVariants({ variant, size });
}
