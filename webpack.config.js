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
		entry: './src/index',

		mode: mode,

		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, 'dist')
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

		plugins: [new UglifyJSPlugin()],

	}
};