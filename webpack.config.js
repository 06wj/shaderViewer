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

	return {
		entry: {
			'dist/main':'./src/index',
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

		plugins: [],
		devtool:'source-map'

	}
};