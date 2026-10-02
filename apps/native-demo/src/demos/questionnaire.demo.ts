import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { type ButtonVariants, buttonVariants } from '@spartan-ng/helm/button';
import { Icon } from '../ui/icon';

interface Choice {
	readonly value: string;
	readonly label: string;
	readonly description?: string;
}

interface Question {
	readonly name: string;
	readonly title: string;
	readonly description: string;
	readonly required: boolean;
	readonly multiple: boolean;
	readonly freeform?: string;
	readonly choices: readonly Choice[];
}

const QUESTIONS: readonly Question[] = [
	{
		name: 'direction',
		title: 'What should the agent build next?',
		description: 'Choose a direction or describe another task.',
		required: true,
		multiple: false,
		freeform: 'Describe another feature…',
		choices: [
			{ value: 'tool-calls', label: 'Tool call timeline', description: 'Show what the agent ran and what came back.' },
			{
				value: 'approvals',
				label: 'Approval checkpoints',
				description: 'Ask before sensitive or destructive actions.',
			},
			{
				value: 'handoffs',
				label: 'Sub-agent handoffs',
				description: 'Make delegated work and results easier to follow.',
			},
		],
	},
	{
		name: 'signals',
		title: 'What should every progress update include?',
		description: 'Select all that apply, or skip this question.',
		required: false,
		multiple: true,
		choices: [
			{ value: 'progress', label: 'Progress' },
			{ value: 'decisions', label: 'Decisions' },
			{ value: 'risks', label: 'Risks' },
			{ value: 'next-step', label: 'Next step' },
		],
	},
	{
		name: 'timing',
		title: 'When should work begin?',
		description: 'Choose when the agent should begin the work.',
		required: true,
		multiple: false,
		choices: [
			{ value: 'now', label: 'Start now' },
			{ value: 'next-cycle', label: 'Next development cycle' },
			{ value: 'backlog', label: 'Add it to the backlog' },
		],
	},
];

@Component({
	selector: 'questionnaire-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		@if (_question(); as q) {
			<form data-slot="questionnaire" class="spartan-questionnaire flex w-full min-w-0 flex-col">
				<div
					data-slot="questionnaire-progress"
					class="spartan-questionnaire-progress text-muted-foreground min-h-lh w-fit min-w-[14ch] font-medium tabular-nums"
				>
					<span>Question {{ _step() + 1 }} of {{ _questions.length }}</span>
				</div>

				<fieldset
					data-slot="questionnaire-item"
					data-active=""
					class="spartan-questionnaire-item flex min-w-0 flex-col border-0 p-0 outline-none"
					[attr.data-status]="_invalid() ? 'invalid' : 'valid'"
				>
					<legend data-slot="questionnaire-title" class="spartan-questionnaire-title text-pretty">
						<span>{{ q.title }}</span>
					</legend>
					<p
						data-slot="questionnaire-description"
						class="spartan-questionnaire-description text-muted-foreground text-pretty"
					>
						{{ q.description }}
					</p>
					<div
						data-slot="questionnaire-choices"
						class="spartan-questionnaire-choices group/questionnaire-choices grid min-w-0"
					>
						@for (choice of q.choices; track choice.value; let i = $index) {
							<div
								role="button"
								data-slot="questionnaire-choice"
								class="spartan-questionnaire-choice group/questionnaire-choice relative flex min-h-11 cursor-pointer flex-row items-start text-start outline-none select-none"
								[attr.data-type]="q.multiple ? 'checkbox' : 'radio'"
								[attr.data-checked]="isChecked(q, choice.value) ? '' : null"
								[attr.data-unchecked]="isChecked(q, choice.value) ? null : ''"
								[attr.data-invalid]="_invalid() ? '' : null"
								[attr.data-shortcut]="_letter(i)"
								(click)="toggle(q, choice.value)"
							>
								<div data-slot="questionnaire-choice-indicator" class="spartan-questionnaire-choice-indicator">
									@if (isChecked(q, choice.value) && !q.multiple) {
										<div
											data-slot="questionnaire-choice-indicator-dot"
											class="spartan-questionnaire-choice-indicator-dot"
										></div>
									}
									@if (isChecked(q, choice.value) && q.multiple) {
										<ui-icon
											name="lucideCheck"
											data-slot="questionnaire-choice-indicator-check"
											class="spartan-questionnaire-choice-indicator-check"
										/>
									}
								</div>
								<div
									data-slot="questionnaire-choice-label"
									class="spartan-questionnaire-choice-content flex min-w-0 flex-1 flex-col leading-snug"
								>
									<span [class.font-medium]="!!choice.description">{{ choice.label }}</span>
									@if (choice.description) {
										<span data-slot="questionnaire-choice-description" class="spartan-questionnaire-choice-description">
											{{ choice.description }}
										</span>
									}
								</div>
								<div data-slot="questionnaire-choice-shortcut" class="spartan-questionnaire-shortcut">
									<span>{{ _letter(i) }}</span>
								</div>
							</div>
						}
						@if (q.freeform) {
							<input
								data-slot="questionnaire-input"
								class="spartan-questionnaire-input selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground min-h-11 w-full min-w-0 transition-[color,box-shadow,background-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
								[attr.placeholder]="q.freeform"
								[value]="freeform(q)"
								(input)="write(q, $any($event).target.value)"
							/>
						}
					</div>
					@if (_invalid()) {
						<p data-slot="questionnaire-error" class="spartan-questionnaire-error text-destructive">
							{{ q.required ? 'Choose an answer to continue.' : 'Choose an answer or skip this question.' }}
						</p>
					}
				</fieldset>

				<div
					data-slot="questionnaire-actions"
					class="spartan-questionnaire-actions grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center"
				>
					<button
						data-slot="questionnaire-previous"
						[class]="_action('outline', 'col-start-1 row-start-1 min-h-11 justify-self-start')"
						[attr.data-disabled]="_step() === 0 ? '' : null"
						(click)="previous()"
					>
						Previous
					</button>
					@if (!q.required) {
						<button
							data-slot="questionnaire-skip"
							[class]="_action('outline', 'col-start-2 row-start-1 min-h-11 justify-self-end')"
							(click)="advance()"
						>
							Skip
						</button>
					}
					@if (_last()) {
						<button
							data-slot="questionnaire-submit"
							[class]="_action('default', 'col-start-3 row-start-1 min-h-11 justify-self-end')"
							(click)="next(q)"
						>
							Save plan
						</button>
					} @else {
						<button
							data-slot="questionnaire-next"
							[class]="_action('default', 'col-start-3 row-start-1 min-h-11 justify-self-end')"
							(click)="next(q)"
						>
							Next
						</button>
					}
				</div>
			</form>
		} @else {
			<div class="flex flex-col gap-4">
				<h3 class="text-base font-semibold">Agent plan saved</h3>
				@for (q of _questions; track q.name) {
					<div class="flex flex-col gap-1">
						<p class="text-muted-foreground text-xs font-medium">{{ q.title }}</p>
						<p class="text-sm">{{ summary(q) }}</p>
					</div>
				}
				<button [class]="_action('outline', 'self-start')" (click)="restart()">Start over</button>
			</div>
		}
	`,
})
export default class QuestionnaireDemo {
	protected readonly _questions = QUESTIONS;
	protected readonly _step = signal(0);
	protected readonly _answers = signal<Record<string, readonly string[]>>({});
	protected readonly _invalid = signal(false);
	protected readonly _question = computed<Question | undefined>(() => QUESTIONS[this._step()]);
	protected readonly _last = computed(() => this._step() === QUESTIONS.length - 1);

	protected readonly _letter = (index: number) => String.fromCharCode(65 + index);
	protected readonly _action = (variant: ButtonVariants['variant'], layout: string) =>
		`${buttonVariants({ variant })} ${layout}`;

	protected isChecked(q: Question, value: string) {
		return (this._answers()[q.name] ?? []).includes(value);
	}

	protected freeform(q: Question) {
		const [answer] = this._answers()[q.name] ?? [];
		return answer && !q.choices.some((choice) => choice.value === answer) ? answer : '';
	}

	protected toggle(q: Question, value: string) {
		const current = this._answers()[q.name] ?? [];
		const next = q.multiple
			? current.includes(value)
				? current.filter((item) => item !== value)
				: [...current, value]
			: [value];
		this._answers.update((answers) => ({ ...answers, [q.name]: next }));
		this._invalid.set(false);
	}

	protected write(q: Question, text: string) {
		this._answers.update((answers) => ({ ...answers, [q.name]: text.trim() ? [text] : [] }));
		this._invalid.set(false);
	}

	protected next(q: Question) {
		if (q.required && !this._answers()[q.name]?.length) {
			this._invalid.set(true);
			return;
		}
		this.advance();
	}

	protected advance() {
		this._invalid.set(false);
		this._step.update((step) => step + 1);
	}

	protected previous() {
		this._invalid.set(false);
		this._step.update((step) => Math.max(0, step - 1));
	}

	protected summary(q: Question) {
		const values = this._answers()[q.name] ?? [];
		if (!values.length) return 'Skipped';
		return values.map((value) => q.choices.find((choice) => choice.value === value)?.label ?? value).join(', ');
	}

	protected restart() {
		this._answers.set({});
		this._step.set(0);
	}
}
