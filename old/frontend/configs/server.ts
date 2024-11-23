import webpack from 'webpack';
import express from 'express';
import dev from 'webpack-dev-middleware';
import hot from 'webpack-hot-middleware';
import webpackConfig from './webpack/webpack.dev';

const compiler = webpack(webpackConfig);
const app = express();

app.use(dev(compiler));
app.use(
  hot(compiler, {
    log: false,
    path: `/__webpack_hmr`,
    heartbeat: 10 * 1000,
  })
);
app.use(express.static('public'));

app.listen(3000, () => console.log('App listening on port 3000!'));
