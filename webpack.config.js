const path = require('path');
const { EnvironmentPlugin } = require('./node_modules/webpack');

const developmentConfig = require('./config/config.development.json');
const productionConfig = require('./config/config.production.json');

const environments = process.env.APP_ENV === 'production' ? productionConfig : developmentConfig;

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'electron-main',
  entry: {
    main: './main/main.ts',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'electron.js',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    alias: {
      app: path.resolve(__dirname, './'),
      resources: environments === 'production' ? process.resourcesPath : './resources',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          babelrc: false,
          presets: [
            [
              '@babel/preset-env',
              { targets: 'maintained node versions' },
            ],
            '@babel/preset-typescript',
          ],
          plugins: [
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development',
      APP_ENV: process.env.APP_ENV || 'development',
      ...environments,
    }),
  ],
};
