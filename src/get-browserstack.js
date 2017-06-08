import {readFileSync} from 'fs';
import {sync as mkdirp} from 'mkdirp';
import request from 'then-request';
import saveBrowsers from './save-browsers';

const BLACKLISTED_KEYS = [];
const WHITELISTED_KEYS = [
  'platform',
  'browserName',
  'device',
  'browser_version',
  'os',
  'os_version',
];

const browsers = {};

function write(browserID, version, platform, browser) {
  platform = platform.toLowerCase();
  const capabilities = {};
  Object.keys(browser).forEach(key => {
    if (BLACKLISTED_KEYS.includes(key)) return;
    if (!WHITELISTED_KEYS.includes(key)) {
      console.dir(browser);
      throw new Error('Unrecognised key ' + key);
    }
    capabilities[key] = browser[key];
  });

  if (!(browserID in browsers)) browsers[browserID] = {};
  if (!(version in browsers[browserID])) browsers[browserID][version] = {};
  browsers[browserID][version][platform] = capabilities;
}

const USERNAME = 'forbeslindesay1';
const ACCESS_KEY = readFileSync(
  __dirname + '/../browserstack-key.txt',
  'utf8'
).trim();

request('get', 'https://www.browserstack.com/automate/browsers.json', {
  headers: {
    authorization:
      'Basic ' + new Buffer(USERNAME + ':' + ACCESS_KEY).toString('base64'),
  },
})
  .getBody('utf8')
  .then(JSON.parse)
  .then(browsers => {
    mkdirp(__dirname + '/../lib/');
    browsers.forEach(browser => {
      if (browser.os === 'android') {
        write('android', browser.os_version, browser.device, {
          browserName: 'android',
          platform: 'ANDROID',
          device: browser.device,
        });
        return;
      }
      if (browser.os === 'ios') {
        write('ios', browser.os_version, browser.device, {
          browserName: browser.browser === 'iphone' ? 'iPhone' : 'iPad',
          platform: 'MAC',
          device: browser.device,
        });
        return;
      }
      const version = +browser.browser_version;
      write(
        browser.browser,
        browser.browser === 'safari' && version > 5 && version < 7
          ? browser.browser_version
          : browser.browser_version.split('.')[0],
        browser.os_version.toLowerCase() === 'el capitan'
          ? 'capitan'
          : (browser.os.toLowerCase() === 'windows' &&
              browser.os_version.toLowerCase() !== 'xp'
              ? 'win'
              : '') + browser.os_version.toLowerCase().replace(/ /g, '_'),
        {
          browserName: browser.browser,
          browser_version: browser.browser_version,
          os: browser.os,
          os_version: browser.os_version,
        }
      );
    });
  })
  .done(() => {
    saveBrowsers(__dirname + '/../lib/browser-stack.js', browsers);
  });
