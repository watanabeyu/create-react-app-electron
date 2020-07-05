const path = require('path');
const { spawn } = require('child_process');
const { EnvironmentPlugin } = require('./node_modules/webpack');
const developmentConfig = require('./config/config.development.json');
const productionConfig = require('./config/config.production.json');

module.exports = {
  webpack: (config) => {
    /* plugin */
    const { plugins } = config;
    const environments = process.env.APP_ENV === 'production' ? productionConfig : developmentConfig;

    plugins.push(new EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development',
      APP_ENV: process.env.APP_ENV || 'development',
      ...environments,
    }));

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          app: path.resolve(__dirname, './'),
        },
      },
      plugins,
    };
  },
  devServer: (configFunction) => {
    const { NODE_ENV } = process.env;

    return (proxy, allowedHost) => {
      const config = configFunction(proxy, allowedHost);

      if (NODE_ENV === 'production') {
        return config;
      }

      return {
        port: 3000,
        compress: true,
        noInfo: true,
        stats: 'errors-only',
        inline: true,
        transportMode: 'ws',
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
          verbose: true,
          disableDotRule: false,
        },
        before() {
          console.log('Starting main process');

          spawn('npm', ['run', 'electron'], { shell: true, env: process.env, stdio: 'inherit' })
            .on('close', (code) => process.exit(code))
            .on('error', (spawnError) => console.error(spawnError));
        },
      };
    };
  },
};
