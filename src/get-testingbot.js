import {sync as mkdirp} from 'mkdirp';
import request from 'then-request';
import saveBrowsers from './save-browsers';

const BLACKLISTED_KEYS = ['selenium_name', 'name', 'browser_id'];
const WHITELISTED_KEYS = [
  'platform',
  'version',
  'browserName',
  'deviceName',
  'platformName',
];

const browsers = {};

function write(browserID, version, platform, browser) {
  if (browserID === 'internet explorer') {
    browserID = 'ie';
  }
  if (browserID === 'microsoftedge') {
    browserID = 'edge';
  }
  platform = platform.toLowerCase();
  platform = platform.replace(/^nexus/, 'google nexus');
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

request('get', 'https://api.testingbot.com/v1/browsers', {
  qs: {type: 'webdriver'},
})
  .getBody('utf8')
  .then(JSON.parse)
  .then(browsers => {
    mkdirp(__dirname + '/../lib/');
    browsers.forEach(browser => {
      if (browser.platformName === 'Android') {
        write('android', browser.version, browser.deviceName, {
          platform: browser.platform,
          version: browser.version,
          browserName: browser.name,
          deviceName: browser.deviceName,
          platformName: browser.platformName,
        });
      } else if (browser.platformName === 'iOS') {
        write('ios', browser.version, browser.deviceName, browser);
      } else {
        write(browser.name, browser.version, browser.platform.toLowerCase(), {
          platform: browser.platform,
          version: browser.version,
          browserName: browser.name,
        });
      }
    });
  })
  .done(() => {
    saveBrowsers(__dirname + '/../lib/testing-bot.js', browsers);
  });
