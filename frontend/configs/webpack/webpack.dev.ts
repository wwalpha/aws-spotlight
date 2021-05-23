import * as path from 'path';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.base';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import Dotenv from 'dotenv-webpack';

const dev: Configuration = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: ['webpack-hot-middleware/client'],
  plugins: [
    new Dotenv({
      path: './.env.dev',
    }),
    new HtmlWebpackPlugin({
      title: 'development',
      filename: 'index.html',
      template: path.join(__dirname, '../ejs/app.ejs'),
      minify: false,
      hash: true,
      inject: 'body',
    }),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    // new CompressionPlugin({
    //   test: /\.js$/,
    //   filename: '[path].gz[query]',
    // }),
  ],
};

export default merge(baseConfig, dev);
