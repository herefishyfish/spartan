# native-demo

A NativeScript Angular app that renders spartan/ui natively on iOS and Android with spartan's own helm and brain
directives. [MasonKit](https://github.com/triniwiz/nativescript-mason) gives NativeScript HTML-shaped elements
(`div`, `span`, `button`, `input`, ...) with a web layout engine (flexbox, grid), and `@nativescript/tailwind`
compiles the real spartan theme (`libs/registry/src/styles/style-vega.css`) into NativeScript CSS, so
`<button hlmBtn variant="outline">` in a NativeScript template is the same directive, classes and theme as on the
web.

## Run it

The app is a standalone NativeScript project with its own install, so the workspace keeps its web toolchain.
Install the workspace first (the helm and brain sources type-check against it), then the app:

```bash
pnpm install
cd apps/native-demo
pnpm install
ns run ios       # Vite dev server with HMR
ns run android --no-hmr
```

Android currently needs `--no-hmr`: under the Vite HMR session `com.tns.NativeScriptActivity` is served over
HTTP, so Android's static binding generator never sees it and the app cannot start.

Open a demo directly, skipping the list:

```bash
xcrun simctl launch booted ng.spartan.nativedemo -demo accordion
adb shell am start -n ng.spartan.nativedemo/com.tns.NativeScriptActivity -e demo accordion
```

Type-check the app, templates and the helm/brain sources it uses included, without a device:

```bash
cd apps/native-demo
node_modules/.bin/ngc -p tsconfig.app.json --noEmit
```

The app pins the workspace's Angular, CDK and TypeScript versions so both resolve one set of Angular types; keep
them in step when the workspace upgrades. After changing a patch or a dependency, delete
`node_modules/.ns-vite` (the dev server's pre-bundle cache does not key on patches).

## Running spartan on NativeScript

`src/spartan-native.ts` and `src/native-globals.ts` are what spartan needs from a NativeScript app, beyond MasonKit:

- `registerSpartanNativeElements()` backs `button`, `a`, `li`, `kbd` and `label` with MasonKit blocks (MasonKit
  makes them inline text runs, which ignore the flex classes spartan gives buttons, links, list items, key caps
  and labels) and registers `ng-icon` as
  a text element.
- `provideSpartanNativeScript()` gives `@angular/cdk` a non-browser `Platform` (NativeScript reports
  `PLATFORM_ID` `'browser'`, after which CDK reaches for `window` and `document` listeners), adds the
  `querySelector` brain uses to find labels, and turns off Angular's dev-mode image checks.
- `native-globals` stubs `window.addEventListener`, which CDK calls while its modules load. `main.ts` imports it
  first.
- `@ng-icons/core` is aliased (`vite.config.mts`) to `src/shims/ng-icons-core.ts`, whose `ng-icon` draws the
  lucide glyph font, so helm templates render their icons unchanged.
- `src/app.css` maps `dark:` to NativeScript's `.ns-dark` and makes `motion-safe:` unconditional (media queries
  are dropped). `src/native-overrides.css` holds stand-ins for rules NativeScript CSS cannot express, each next to
  the rule it replaces.

## Add a demo

Create `src/demos/<slug>.demo.ts`, where `<slug>` is the docs route (`spartan.ng/components/<slug>`).
The list and the `demo/:slug` route pick it up from the file name; its default export is the component.

```ts
@Component({
	selector: 'badge-demo',
	imports: [HlmBadge, NgIcon],
	providers: [provideIcons({ lucideBadgeCheck })],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		<div hlmBadge variant="secondary">
			<ng-icon name="lucideBadgeCheck" />
			Verified
		</div>
	`,
})
export default class BadgeDemo {}
```

Use the helm directives and components as the docs previews in
`apps/app/src/app/pages/(components)/components/(<slug>)/` do. Where a spartan rule depends on CSS NativeScript
cannot match (`:has()`, `::before`/`::after`, container queries), add the resulting classes in the demo next to a
comment naming the rule, or a stand-in to `native-overrides.css` when it applies everywhere.

Components whose brain layer is built on the CDK overlay, CDK menu, pointer capture or DOM measurement (dialog,
sheet, popover, select, combobox, menus, tooltip, hover-card, drawer, slider, resizable, sonner, carousel, chart,
message-scroller, navigation-menu, date-picker) still mirror helm's markup and open through the `Overlays` service
below until those layers have native implementations. Calendar and table mirror helm's markup because helm builds
them from `table` elements, which MasonKit does not have. Input OTP keeps a native number field: brain's input sets
`inputMode` and `autocomplete="one-time-code"`, which MasonKit ignores, so the real one gets a full keyboard and no
code autofill.

## MasonKit rules

- Text elements (`span`, `p`, `h1`-`h6`) lay their children out as inline text runs and ignore flex (`button`,
  `a`, `li`, `kbd` and `label` are remapped to blocks, see above). An element that spartan styles as a flex box
  (a badge, an item title, a select group label) must be a `div`; it still takes the `flex`/`inline-flex`
  classes. A `span` with them measures its text at the wrong width when it is stretched in a column.
- Listen with `(click)`. For `<input>` and `<textarea>`, bind `[value]` and read `$any($event).target.value`
  in `(input)`.
- In demos that mirror helm's markup, drive state with signals and the same attributes helm sets: `[attr.data-state]` (`open`/`closed`,
  `checked`/`unchecked`, `active`/`inactive`, `on`/`off`), `[attr.data-disabled]`, `[attr.data-orientation]`,
  `[attr.data-size]`, and so on. The style-vega rules select on these.
- Icons: `<ng-icon name="lucideChevronDown" />` with `provideIcons`, as on the web.
- Lengths are unitless (device-independent pixels).
- `display: contents` (switch, checkbox) lays out as a flex box sized to its child.
- Use either a static `class` or a `[class]` binding on an element, not both; `[class.name]` toggles are fine.
- `:first-child`, `:last-child` and `:only-child` match (the MasonKit patch tracks them), so helm's
  `first:`/`last:`/`[&>*:not(:first-child)]:` classes work.

## Overlays

`src/ui/overlays.ts` stands in for the CDK overlay. Put the panel in an `<ng-template let-ref>` and open it with
the kind that matches the component. Each kind uses the native surface for that pattern:

```ts
private readonly _overlays = inject(Overlays);

// dialog, alert-dialog, command: centered in a layer over spartan's dialog backdrop (back button closes it)
this._overlays.open(this._panel(), { kind: 'modal' });
// sheet, sidebar: an edge panel in the page's native drawer (@nativescript-community/ui-drawer)
this._overlays.open(this._panel(), { kind: 'sheet', side: 'left' });
// drawer (vaul): the native modal bottom sheet (@nativescript-community/ui-material-bottomsheet)
this._overlays.open(this._panel(), { kind: 'drawer' });
// popover, select, combobox, tooltip, ...: a native popover window at a trigger (@nativescript-community/ui-popover)
this._overlays.open(this._panel(), { kind: 'anchored', anchor: trigger, side: 'bottom', align: 'start' });
```

`anchor` is a `#trigger` read with `{ read: ElementRef<View> }`. `_overlays.isOpen(ref)` is true while a panel
of any kind shows, for the trigger's `aria-expanded`. The panel keeps the helm structure
(`spartan-dialog-content`, `data-state="open"`, ...). `dialog.demo.ts`, `sheet.demo.ts`, `drawer.demo.ts` and
`popover.demo.ts` are the references. Toasts are data, like sonner's API:
`inject(Overlays).toast('Saved', { type: 'success' })`.

Menus whose content is plain actions use the platform menu instead of a panel
(`@nstudio/nativescript-menu`): bind `[menu]` (tap) or `[contextMenu]` (long press) on any element to
`nativeMenu([...])` from `src/ui/menu.ts` and read `(selected)`. `context-menu.demo.ts` and
`native-select.demo.ts` are the references.

## Native containers

A MasonKit element whose parent is a native NativeScript view (`GridLayout`, `ScrollView`, `Pager`, a drawer
slot) lays its children out against its own explicit dimensions only. Percentages, `h-full`, stretching and
centering inside it fall back to content size unless you give that root a `width`/`height` (the demo page
does this for overlay layers and drawer slots, and `carousel.demo.ts` binds the pager's measured width onto
each slide).

Where a component needs native behaviour, the demo uses a NativeScript plugin:

| Plugin                                            | Used for                                                        |
| ------------------------------------------------- | --------------------------------------------------------------- |
| `@nativescript-community/ui-pager`                | `carousel` swiping                                              |
| `@nativescript-community/ui-chart`                | `chart`                                                         |
| `@nativescript-community/ui-drawer`               | `sheet` and `sidebar` edge panels                               |
| `@nativescript-community/ui-material-bottomsheet` | `drawer`                                                        |
| `@nativescript-community/ui-popover`              | anchored panels                                                 |
| `@nstudio/nativescript-menu`                      | `context-menu`, `native-select`                                 |
| `@nativescript/datetimepicker`                    | the `date-picker` native dialog                                 |
| `@nativescript/haptics`                           | selection feedback on switch, checkbox, toggle and toggle-group |

Plugins with native code must also be listed in this app's `package.json` so the CLI builds them.

## CSS limits

`@nativescript/tailwind` is patched (`patches/@nativescript__tailwind@4.0.10.patch`) to pass through the CSS
MasonKit supports. Some web CSS still has no native equivalent:

- Responsive (`sm:`, `md:`) and container (`@md/...`) variants are dropped, so demos get the mobile layout.
- `:has()`, `::before`/`::after`, `:focus-within` and `ltr:`/`rtl:` do not match. `ltr:` rules are applied
  unconditionally, and logical properties (`ps-*`, `ms-*`, `rounded-s-*`) become left-to-right physical ones.
- Transforms and `calc()` take no percentages. `width`/`height` accept `fit-content`, `min-content` and
  `max-content`; min and max sizes do not.
- Spartan's rules are `.style-vega .spartan-*` descendant selectors, so an element only picks them up inside an
  ancestor with `style-vega`. The demo page provides it.

When a spartan rule cannot be expressed, add an equivalent to `src/native-overrides.css` next to a comment
naming the rule it stands in for.

Why each patch in `patches/` exists:

- `@nativescript/tailwind`: flattens Tailwind v4's nested rules instead of deleting them; allows MasonKit's
  properties and `:hover`/`:active`; maps logical and individual-transform properties; strips values
  NativeScript cannot parse (`inherit`, `var()` in animations and keyframes, `@container`), any one of which
  silently drops the whole stylesheet. Lets intrinsic `width`/`height` through.
- `@triniwiz/nativescript-masonkit`: clears `color` and `background-color` when a class that set them is
  removed; keeps `:first-child`/`:last-child`/`:only-child` current; starts loading an `img` as soon as `src` is
  set and emits `load`/`error` (helm's avatar shows the image after `load`); lays out `display: contents` as a
  flex box.
- `@nativescript/angular`: emits `<name>Change` when an attribute binding changes, which is what re-matches
  `[data-state=...]` rules; `removeAttribute` (an `[attr.x]` bound to `null`) clears the property; boots under
  the `@nativescript/vite` HMR session, where the app has launched before Angular bootstraps.
- `@nativescript/core`: notifies `data-*`/`aria-*` changes so attribute selectors re-match; tracks ancestor
  attributes for complex selectors inside `:is()`/`:where()`, so `group-data-[size=sm]/switch:` re-matches when
  the group's attribute arrives late; parses `fit-content`/`min-content`/`max-content` lengths.
- `@nativescript/vite`: treats `.mjs` as ESM when bridging pre-bundled dependencies (minified `clsx.mjs` lost its
  named exports) and keeps class names in its esbuild pre-bundles (bundling renamed `TextNode`, which MasonKit's
  Angular adapter identifies by name).
