/**
 * Merely reads the webpack config from react-scripts and exports the re-wired
 * config
 */
const { paths } = require('react-app-rewired');
const configFromEnv = require(paths.scriptVersion + '/config/webpack.config');
const overrides = require('./config-overrides');

const env = process.env.NODE_ENV || 'development';
const config = configFromEnv(env);

module.exports = overrides.webpack(configFromEnv(config), env);
