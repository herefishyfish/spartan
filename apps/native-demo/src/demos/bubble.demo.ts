import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmButton } from '@spartan-ng/helm/button';

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

// The class helpers above serve the message demos; this demo uses the helm directives.
@Component({
	selector: 'bubble-demo',
	imports: [HlmBubbleImports, HlmButton],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Variants</h3>
			<div class="flex flex-row flex-wrap gap-2">
				@for (option of _variants; track option) {
					<button
						hlmBtn
						size="sm"
						[variant]="option === _variant() ? 'default' : 'outline'"
						(click)="_variant.set(option)"
					>
						{{ option }}
					</button>
				}
			</div>
			<div class="flex flex-col gap-4">
				<div hlmBubble align="end" [variant]="_variant()">
					<div hlmBubbleContent>
						<span>This is the {{ _variant() }} variant.</span>
					</div>
				</div>
				<div hlmBubble [variant]="_variant()">
					<div hlmBubbleContent>
						<span>Tap a variant above to restyle both bubbles.</span>
					</div>
				</div>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Group and reactions</h3>
			<div class="flex flex-col gap-4">
				<div hlmBubble align="end">
					<div hlmBubbleContent><span>Hey there! what's up?</span></div>
				</div>
				<div hlmBubbleGroup>
					<div hlmBubble variant="muted">
						<div hlmBubbleContent><span>Hey! Want to see chat bubbles?</span></div>
					</div>
					<div hlmBubble variant="muted" (click)="_liked.set(!_liked())">
						<div hlmBubbleContent>
							<span>I can group messages, switch sides, and keep the whole thread easy to scan. Tap me.</span>
						</div>
						@if (_liked()) {
							<div hlmBubbleReactions>
								<span>👍</span>
							</div>
						}
					</div>
				</div>
				<div hlmBubble align="end">
					<div hlmBubbleContent>
						<span>Tests passed on the first try. All 142 of them.</span>
					</div>
					<div hlmBubbleReactions side="top" align="start">
						<span>🎉</span>
						<span>👏</span>
					</div>
				</div>
				<div hlmBubble variant="destructive">
					<div hlmBubbleContent>
						<span>{{ _ran() ? 'Command finished.' : 'Are you sure I can run this command?' }}</span>
					</div>
					@if (!_ran()) {
						<div hlmBubbleReactions>
							<button hlmBtn variant="ghost" size="xs" (click)="_ran.set(true)">Yes, run it</button>
						</div>
					}
				</div>
			</div>
		</section>

		<section class="flex flex-col gap-3">
			<h3 class="text-sm font-medium">Ghost</h3>
			<div hlmBubble variant="ghost">
				<div hlmBubbleContent class="flex flex-col gap-4">
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
}
