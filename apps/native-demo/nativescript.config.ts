import { NativeScriptConfig } from '@nativescript/core';

export default {
	id: 'ng.spartan.nativedemo',
	appPath: 'src',
	appResourcesPath: 'App_Resources',
	bundler: 'vite',
	bundlerConfigPath: 'vite.config.mts',
	cli: {
		packageManager: 'pnpm',
		additionalPathsToClean: ['.ns-vite-build'],
	},
	android: {
		v8Flags: '--expose_gc',
		markingMode: 'none',
	},
} as NativeScriptConfig;
