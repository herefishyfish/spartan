import type { Type } from '@angular/core';

export interface DemoEntry {
	/** Matches the docs route, e.g. `button` for spartan.ng/components/button. */
	readonly slug: string;
	readonly name: string;
	readonly load: () => Promise<Type<unknown>>;
}

interface LazyContext {
	keys(): string[];
	(key: string): Promise<{ default: Type<unknown> }>;
}

// Every `<slug>.demo.ts` in this folder is a demo; its default export is the demo component.
const context = (
	import.meta as unknown as { webpackContext: (dir: string, options: object) => LazyContext }
).webpackContext('./', { recursive: false, regExp: /\.demo\.ts$/, mode: 'lazy' });

const titleCase = (slug: string) =>
	slug.replace(/(^|-)(\w)/g, (_, dash: string, char: string) => (dash ? ' ' : '') + char.toUpperCase());

export const DEMOS: readonly DemoEntry[] = context
	.keys()
	.filter((key) => key.startsWith('./'))
	.map((key) => {
		const slug = key.slice(2, -'.demo.ts'.length);
		return { slug, name: titleCase(slug), load: () => context(key).then((m) => m.default) };
	})
	.sort((a, b) => a.slug.localeCompare(b.slug));

export const findDemo = (slug: string) => DEMOS.find((demo) => demo.slug === slug);
