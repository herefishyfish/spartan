# native-demo

A NativeScript Angular app that renders every spartan/ui component natively on iOS and Android.
[MasonKit](https://github.com/triniwiz/nativescript-mason) gives NativeScript HTML-shaped elements
(`div`, `span`, `button`, `input`, ...) with a web layout engine (flexbox, grid), and
`@nativescript/tailwind` compiles the real spartan theme (`libs/registry/src/styles/style-vega.css`) into
NativeScript CSS. The demos use the same `spartan-*` classes and `data-slot` attributes as the helm
directives, so they track the web styles.

## Run it

```bash
cd apps/native-demo
ns run android
```

On Windows, if Gradle reports `'gradlew.bat' is not recognized`, the shell has
`NoDefaultCurrentDirectoryInExePath` set; unset it for the command.

Open a demo directly, skipping the list:

```bash
adb shell am start -n ng.spartan.nativedemo/com.tns.NativeScriptActivity -e demo accordion
```

Type-check the app, templates included, without a device:

```bash
pnpm exec ngc -p apps/native-demo/tsconfig.app.json --noEmit
```

## Add a demo

Create `src/demos/<slug>.demo.ts`, where `<slug>` is the docs route (`spartan.ng/components/<slug>`).
The list and the `demo/:slug` route pick it up from the file name; its default export is the component.

```ts
@Component({
	selector: 'badge-demo',
	imports: [Icon],
	schemas: [NO_ERRORS_SCHEMA],
	host: { class: 'flex flex-col gap-6' },
	template: `
		...
	`,
})
export default class BadgeDemo {}
```

Mirror the helm directive for each part. Every helm directive in `libs/helm/<component>/src/lib` is a
`data-slot`, maybe some attributes, and a class string passed to `classes()` or `hlm()`. Copy all three onto
the matching element, including the `group/<name>` classes, because variants such as
`group-data-[size=sm]/switch:` select on them. Where helm exports a variant function (`buttonVariants`,
`badgeVariants`, ...), import it and call it. Model the content on the docs previews in
`apps/app/src/app/pages/(components)/components/(<slug>)/`.

## MasonKit rules

- Text elements (`span`, `p`, `h1`-`h6`, `li`, `a`, `label`, `kbd`) lay their children out as inline text runs
  and ignore flex. An element that spartan styles as a flex box (a badge, an item title, a select group label) must
  be a `div`; it still takes the `flex`/`inline-flex` classes. A `span` with them measures its text at the
  wrong width when it is stretched in a column.
- `<button>` is registered as a block element (see `main.ts`), so spartan's `inline-flex items-center gap-*`
  button classes lay icons and labels out as on the web.
- Listen with `(click)`. For `<input>` and `<textarea>`, bind `[value]` and read `$any($event).target.value`
  in `(input)`.
- Drive state with signals and the same attributes helm sets: `[attr.data-state]` (`open`/`closed`,
  `checked`/`unchecked`, `active`/`inactive`, `on`/`off`), `[attr.data-disabled]`, `[attr.data-orientation]`,
  `[attr.data-size]`, and so on. The style-vega rules select on these.
- Icons: `<ui-icon name="lucideChevronDown" />`, the `@ng-icons/lucide` export names helm uses.
- Lengths are unitless (device-independent pixels).

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

When a spartan rule cannot be expressed, add a pixel equivalent to `src/native-overrides.css` next to a
comment naming the rule it stands in for.

Why each patch exists:

- `@nativescript/tailwind`: flattens Tailwind v4's nested rules instead of deleting them; allows MasonKit's
  properties and `:hover`/`:active`; maps logical and individual-transform properties; strips values
  NativeScript cannot parse (`inherit`, `var()` in animations and keyframes, `@container`), any one of which
  silently drops the whole stylesheet. Lets intrinsic `width`/`height` through.
- `@triniwiz/nativescript-masonkit`: clears `color` and `background-color` when a class that set them is
  removed, instead of keeping the stale value, and keeps `:first-child`/`:last-child`/`:only-child` current.
- `@nativescript/angular`: backports the v22 `selectRootElement` fix Angular 21.2 needs to bootstrap, and
  emits `<name>Change` when an attribute binding changes, which is what re-matches `[data-state=...]` rules.
  `removeAttribute` (an `[attr.x]` bound to `null`) clears the property instead of doing nothing.
- `@nativescript/core`: notifies `data-*`/`aria-*` changes so attribute selectors re-match, and parses
  `fit-content`/`min-content`/`max-content` lengths (core layouts treat them as `auto`; MasonKit sizes by content).
- `@nativescript-community/ui-canvas` and `gesturehandler` (used by the chart): find `@nativescript/core` by
  walking up from the app, as Node does, instead of assuming `apps/native-demo/node_modules`.
