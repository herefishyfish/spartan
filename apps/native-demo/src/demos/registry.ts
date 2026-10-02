import type { Type } from '@angular/core';

export interface DemoEntry {
	/** Matches the docs route, e.g. `button` for spartan.ng/components/button. */
	readonly slug: string;
	readonly name: string;
	readonly load: () => Promise<Type<unknown>>;
}

// Every `<slug>.demo.ts` in this folder is a demo; its default export is the demo component.
const modules = import.meta.glob<{ default: Type<unknown> }>('./*.demo.ts');

const titleCase = (slug: string) =>
	slug.replace(/(^|-)(\w)/g, (_, dash: string, char: string) => (dash ? ' ' : '') + char.toUpperCase());

export const DEMOS: readonly DemoEntry[] = Object.entries(modules)
	.map(([path, load]) => {
		const slug = path.slice(2, -'.demo.ts'.length);
		return { slug, name: titleCase(slug), load: () => load().then((m) => m.default) };
	})
	.sort((a, b) => a.slug.localeCompare(b.slug));

export const findDemo = (slug: string) => DEMOS.find((demo) => demo.slug === slug);
