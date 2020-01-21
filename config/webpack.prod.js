const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin(),
        new CleanWebpackPlugin()
    ],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../dist')
    }
});