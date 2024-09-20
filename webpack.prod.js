/** @format */
require('dotenv').config();
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.EnvironmentPlugin([
      'REACT_APP_WEB_VERSION',
      'NODE_ENV',
      'REACT_APP_IS_PROD',
      // "REACT_APP_API_PORT",
    ]),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    path: path.join(__dirname, '/build'), // Folder that store file has been built
    filename: 'bundle.js', // Built file name
    publicPath: '/',
    clean: true,
  },
  devtool: false,
  optimization: {
    ...common.optimization,
    minimize: true,
    chunkIds: 'deterministic',
    moduleIds: 'deterministic',
    removeAvailableModules: true,
    removeEmptyChunks: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: true,
          format: { comments: false },
        },
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              [
                'svgo',
                {
                  multipass: true, // boolean. false by default
                  js2svg: {
                    indent: 2, // string with spaces or number of spaces. 4 by default
                    pretty: true, // boolean, false by default
                  },
                  plugins: [
                    // set of built-in plugins enabled by default
                    'preset-default',
                    // enable built-in plugins by name
                    'prefixIds',
                    // or by expanded notation which allows to configure plugin
                    {
                      name: 'sortAttrs',
                      params: {
                        xmlnsOrder: 'alphabetical',
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
});
