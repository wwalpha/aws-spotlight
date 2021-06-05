import { Configuration, EnvironmentPlugin } from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.base';
import CompressionPlugin from 'compression-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';

const prod: Configuration = {
  plugins: [
    new EnvironmentPlugin(['API_URL', 'AWS_DEFAULT_REGION']),
    new HtmlWebpackPlugin({
      title: 'production',
      filename: 'index.html',
      template: path.join(__dirname, '../ejs/app.ejs'),
      minify: false,
      hash: true,
      inject: 'body',
    }),
    // new CompressionPlugin({
    //   test: /\.js$/,
    //   filename: '[path].gz[query]',
    // }),
  ],
};

export default merge(baseConfig, prod);
