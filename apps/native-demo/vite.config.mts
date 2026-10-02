import { angularConfig } from '@nativescript/vite/angular';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const require = createRequire(import.meta.url);
const workspaceRoot = resolve(__dirname, '../..');

const appDependencies = Object.keys(JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8')).dependencies);
const rootDependencies = Object.keys(
	JSON.parse(readFileSync(join(workspaceRoot, 'package.json'), 'utf8')).dependencies,
);

// The vendor pre-bundle seeds root dependencies imported anywhere under a tsconfig.base.json path, i.e. every lib in
// the web workspace. Those resolve from the root node_modules (a second Angular); the device only gets this app's.
// @ng-icons/core is aliased to a shim below, so the real package must not be pre-bundled either.
process.env['NS_VENDOR_EXCLUDE'] = [
	...rootDependencies.filter((name) => !appDependencies.includes(name)),
	'@ng-icons/core',
].join(',');

// libs/helm and libs/brain sit outside this project; their bare imports must resolve to this app's node_modules.
const dedupedPackages = appDependencies.filter((name) => !name.startsWith('@nativescript'));

export default defineConfig(
	({ mode }): UserConfig =>
		mergeConfig(angularConfig({ mode }), {
			// MasonKit branches on __WINDOWS__, which @nativescript/vite does not define.
			define: { __WINDOWS__: 'false' },
			resolve: {
				dedupe: dedupedPackages,
				alias: [{ find: /^@ng-icons\/core$/, replacement: join(__dirname, 'src/shims/ng-icons-core.ts') }],
			},
			// Bundling renames colliding classes (@nativescript/angular's TextNode becomes TextNode$1 next to MasonKit's);
			// NativeScript CSS type selectors and MasonKit's Angular adapter key off class names.
			build: { rolldownOptions: { output: { keepNames: true } } },
			plugins: [
				viteStaticCopy({
					targets: [
						{ src: require.resolve('lucide-static/font/lucide.ttf'), dest: 'fonts', rename: { stripBase: true } },
					],
				}),
			],
		}),
);
