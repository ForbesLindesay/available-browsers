# available-browsers

Available browsers for sauce labs, browser stack and testing bot.  This lets you get the capabilities for the platform of your choice, and switch effortlessly between them.

[![Build Status](https://img.shields.io/travis/ForbesLindesay/available-browsers/master.svg)](https://travis-ci.org/ForbesLindesay/available-browsers)
[![Dependency Status](https://img.shields.io/david/ForbesLindesay/available-browsers/master.svg)](http://david-dm.org/ForbesLindesay/available-browsers)
[![NPM version](https://img.shields.io/npm/v/available-browsers.svg)](https://www.npmjs.org/package/available-browsers)

## Installation

```
npm install available-browsers --save
```

## Usage

```js
var availableBrowsers = require('available-browsers');

var capabilities = getCapabilities('browserstack', 'chrome');
```

args:

 - remote: `'browserstack' | 'saucelabs' | 'testingbot'`
 - browser: `'android' | 'chrome' | 'edge' | 'firefox' | 'ie' | 'ios' | 'opera' | 'safari'`
 - version: string - defaults to latest version that's available on all three remotes
 - operating system: string - defaults to latest windows for all desktop browsers except safari, defaults to latest mac on safari, defaults to most recent iPhone/android.

## License

MIT
