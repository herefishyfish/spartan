const webpack = require('@nativescript/webpack');

module.exports = (env) => {
	webpack.init(env);
	webpack.useConfig('angular');

	webpack.Utils.addCopyRule({ from: require.resolve('lucide-static/font/lucide.ttf'), to: 'fonts/lucide.ttf' });

	// MasonKit branches on __WINDOWS__, which @nativescript/webpack does not define yet.
	webpack.chainWebpack((config) => {
		config.plugin('DefinePlugin').tap((args) => {
			Object.assign(args[0], { __WINDOWS__: false });
			return args;
		});
	});

	return webpack.resolveConfig();
};
