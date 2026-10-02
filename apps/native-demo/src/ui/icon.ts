import { ChangeDetectionStrategy, Component, NO_ERRORS_SCHEMA, computed, input } from '@angular/core';
import type * as lucide from '@ng-icons/lucide';
import codepoints from 'lucide-static/font/codepoints.json';

/** Spartan's icon names, as used with `ng-icon` (`lucideChevronDown`). */
export type IconName = keyof typeof lucide;

const glyphFor = (name: IconName) => {
	const kebab = name
		.replace(/^lucide/, '')
		.replace(/(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|(?<=[a-zA-Z])(?=[0-9])/g, '-');
	const codepoint = (codepoints as Record<string, number>)[kebab.toLowerCase()];
	return codepoint === undefined ? '' : String.fromCodePoint(codepoint);
};

/**
 * A Lucide icon drawn from the lucide.ttf glyph font, so it renders in any MasonKit text element and, like
 * `ng-icon`, takes its color and size from the CSS `color` and `font-size`.
 */
@Component({
	selector: 'ui-icon',
	schemas: [NO_ERRORS_SCHEMA],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'inline-flex shrink-0 items-center justify-center' },
	template: `
		<span class="lucide">{{ _glyph() }}</span>
	`,
})
export class Icon {
	public readonly name = input.required<IconName>();
	protected readonly _glyph = computed(() => glyphFor(this.name()));
}
