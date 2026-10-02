import { Component, NO_ERRORS_SCHEMA, computed, signal } from '@angular/core';
import { buttonVariants } from '@spartan-ng/helm/button';
import { hlm } from '@spartan-ng/helm/utils';
import { Icon } from '../ui/icon';

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const sameDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

@Component({
	selector: 'calendar-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div data-slot="calendar" class="spartan-calendar group/calendar bg-background block w-full rounded-md border">
			<div class="flex flex-col gap-4">
				<div class="flex w-full flex-row items-center justify-between gap-1.5">
					<button [class]="_navButton" aria-label="Go to the previous month" (click)="shift(-1)">
						<ui-icon name="lucideChevronLeft" />
					</button>
					<span class="text-sm font-medium">{{ _heading() }}</span>
					<button [class]="_navButton" aria-label="Go to the next month" (click)="shift(1)">
						<ui-icon name="lucideChevronRight" />
					</button>
				</div>
				<div role="grid" class="grid w-full grid-cols-7 gap-y-2">
					@for (weekday of _weekdays; track weekday) {
						<span class="text-muted-foreground text-center text-[0.8rem] font-normal select-none">{{ weekday }}</span>
					}
					@for (day of _days(); track day.date.getTime()) {
						<div
							role="gridcell"
							class="group/day relative aspect-square h-full w-full p-0 text-center select-none"
							[attr.data-selected]="day.selected ? 'true' : null"
						>
							<button
								[class]="_dayButton"
								[attr.data-selected-single]="day.selected ? 'true' : null"
								[attr.data-today]="day.today && !day.selected ? 'true' : null"
								[attr.data-outside]="day.outside && !day.selected ? 'true' : null"
								(click)="select(day.date)"
							>
								{{ day.date.getDate() }}
							</button>
						</div>
					}
				</div>
			</div>
		</div>
		<p class="text-muted-foreground text-sm">Selected {{ _selected().toDateString() }}</p>
	`,
})
export default class CalendarDemo {
	protected readonly _weekdays = WEEKDAYS;
	private readonly _today = new Date();
	protected readonly _selected = signal(
		new Date(this._today.getFullYear(), this._today.getMonth(), this._today.getDate()),
	);
	protected readonly _month = signal(new Date(this._today.getFullYear(), this._today.getMonth(), 1));
	protected readonly _heading = computed(() => `${MONTHS[this._month().getMonth()]} ${this._month().getFullYear()}`);
	protected readonly _days = computed(() => {
		const month = this._month();
		const first = new Date(month.getFullYear(), month.getMonth(), 1 - month.getDay());
		const inMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
		const count = Math.ceil((month.getDay() + inMonth) / 7) * 7;
		return Array.from({ length: count }, (_, i) => {
			const date = new Date(first.getFullYear(), first.getMonth(), first.getDate() + i);
			return {
				date,
				outside: date.getMonth() !== month.getMonth(),
				today: sameDay(date, this._today),
				selected: sameDay(date, this._selected()),
			};
		});
	});

	protected readonly _navButton = hlm(buttonVariants({ variant: 'ghost' }), 'size-8 p-0 select-none');
	protected readonly _dayButton = hlm(
		buttonVariants({ variant: 'ghost', size: 'icon' }),
		'data-[today=true]:bg-muted data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground relative isolate z-10 flex aspect-square size-auto w-full flex-col gap-1 border-0 leading-none font-normal',
		'data-[outside=true]:opacity-50',
	);

	protected shift(months: number) {
		const month = this._month();
		this._month.set(new Date(month.getFullYear(), month.getMonth() + months, 1));
	}

	protected select(date: Date) {
		this._selected.set(date);
		this._month.set(new Date(date.getFullYear(), date.getMonth(), 1));
	}
}
