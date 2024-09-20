/** @format */
const path = require('path');
require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      { test: /\.(mov|mp4)$/, loader: 'url-loader' },
      {
        test: /\.(scss|css)$/,
        use: [
          { loader: 'style-loader' }, // to inject the result into the DOM as a style block
          { loader: 'css-loader', options: { url: true } },
          { loader: 'resolve-url-loader' },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          }, // to convert SASS to CSS
          // NOTE: The first build after adding/removing/renaming CSS classes fails, since the newly generated .d.ts typescript module is picked up only later
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        // exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              compact: false,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png)$/,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            },
          },
          'url-loader',
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
    alias: {
      '@icon': path.resolve(__dirname, 'src/common/ui/assets/icon'),
      '@images': path.resolve(__dirname, 'src/common/ui/assets/images'),
      '@base': path.resolve(__dirname, 'src/common/ui/base'),
      '@layout': path.resolve(__dirname, 'src/common/ui/layout'),
      '@hooks': path.resolve(__dirname, 'src/common/utils/hooks'),
      '@models': path.resolve(__dirname, 'src/models'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
