// Launch script for various Node test configurations

// Enables ES2015 import/export in Node.js
require('reify');

/* global process */
const moduleAlias = require('module-alias');

const getAliases = require('../aliases');
moduleAlias.addAliases(getAliases('src'));

const {BrowserTestDriver} = require('@probe.gl/test-utils');

const mode = process.argv.length >= 3 ? process.argv[2] : 'default';
console.log(`Running ${mode} tests...`); // eslint-disable-line

switch (mode) {
  case 'test':
    require('./modules/index'); // Run the tests
    break;

  case 'test-dist':
    // Load deck.gl itself from the dist folder
    moduleAlias.addAliases(getAliases('dist'));
    require('./modules/index'); // Run the tests
    break;

  case 'test-ci':
    // Run a smaller selection of the tests (avoid overwhelming Travis CI)
    require('./modules/imports-spec');
    require('./modules/core');
    // require('./src/layers');
    require('./modules/layers/polygon-tesselation.spec');
    // require('./layers.spec');
    // require('./polygon-layer.spec');
    require('./modules/layers/geojson.spec');
    // require('./geojson-layer.spec');
    // require('./hexagon-cell-layer.spec');
    // require('./grid-layer.spec');
    // require('./hexagon-layer.spec');
    break;

  case 'bench':
    require('./bench/index'); // Run the benchmarks
    break;

  case 'browser':
  case 'browser-headless':
    new BrowserTestDriver().run({
      command: 'webpack-dev-server',
      arguments: ['--config', 'test/webpack.config.js', '--env.testBrowser'],
      headless: mode === 'browser-headless'
    });
    break;

  case 'render':
  case 'render-headless':
    new BrowserTestDriver().run({
      command: 'webpack-dev-server',
      arguments: ['--config', 'test/webpack.config.js', '--env.render'],
      headless: mode === 'render-headless'
    });
    break;

  case 'render-react':
    new BrowserTestDriver().run({
      command: 'webpack-dev-server',
      arguments: ['--config', 'test/webpack.config.js', '--env.renderReact']
    });
    break;

  case 'bench-browser':
    new BrowserTestDriver().run({
      command: 'webpack-dev-server',
      arguments: ['--config', 'test/webpack.config.js', '--env.bench']
    });
    break;

  default:
    console.error(`Unknown test mode ${mode}`); // eslint-disable-line
}
