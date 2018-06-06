const webpack = require('webpack');
const path = require('path');

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(env, argv) {
	const isDev = !!env;
	const mode = isDev ? 'development' : 'production'; 

	console.log(`webpack-mode:${mode}`);

	const plugins = isDev?[]:[new UglifyJSPlugin()];
	const devtool = isDev?'none':'cheap-source-map';
	
	return {
		entry: {
			'dist/main':'./src/index',
			'dist/compiler':'./src/compiler',
			'extensions/js/result':'./extensions/js/result'
		},

		mode: mode,

		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, '')
		},

		module: {
			rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',

				options: {
					presets: ['env']
				}
			}]
		},

		plugins: plugins,
		devtool:devtool

	}
};