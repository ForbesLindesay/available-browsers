import {sync as mkdirp} from 'mkdirp';
import request from 'then-request';
import saveBrowsers from './save-browsers';

const BLACKLISTED_KEYS = [];
const WHITELISTED_KEYS = [
  'browserName',
  'platform',
  'version',
  'deviceName',
  'deviceOrientation',
  'platformVersion',
  'platformName',
];

const browsers = {};

function write(browserID, version, platform, browser) {
  if (browserID === 'internet explorer') {
    browserID = 'ie';
  }
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

function addDotZero(version) {
  if (/^\d+$/.test(version)) {
    return version + '.0';
  }
  return version;
}

request('get', 'https://saucelabs.com/rest/v1/info/platforms/webdriver')
  .getBody('utf8')
  .then(JSON.parse)
  .then(browsers => {
    mkdirp(__dirname + '/../lib/');
    browsers.forEach(browser => {
      if (
        (browser.api_name === 'chrome' || browser.api_name === 'firefox') &&
        browser.os === 'Windows 10'
      ) {
        write(browser.api_name, browser.short_version, 'win10', {
          browserName: browser.api_name,
          platform: browser.os,
          version: addDotZero(browser.short_version),
        });
        return;
      }
      if (
        browser.api_name === 'internet explorer' &&
        browser.short_version === '11' &&
        browser.os === 'Windows 10'
      ) {
        write(browser.api_name, browser.short_version, 'win10', {
          browserName: browser.api_name,
          platform: browser.os,
          version: '11.103',
        });
        return;
      }
      if (browser.api_name === 'microsoftedge' && browser.os === 'Windows 10') {
        write('edge', browser.short_version, 'win10', {
          browserName: 'MicrosoftEdge',
          platform: browser.os,
          version: browser.long_version,
        });
        return;
      }
      if (
        (browser.api_name === 'chrome' || browser.api_name === 'firefox') &&
        browser.os === 'Linux'
      ) {
        write(
          browser.api_name,
          browser.short_version,
          browser.os.toLowerCase(),
          {
            browserName: browser.api_name,
            platform: browser.os,
            version: addDotZero(browser.short_version),
          }
        );
        return;
      }
      if (browser.api_name === 'opera' && browser.os === 'Linux') {
        write(
          browser.api_name,
          browser.short_version,
          browser.os.toLowerCase(),
          {
            browserName: browser.api_name,
            platform: browser.os,
            version: browser.long_version.replace(/\.$/, ''),
          }
        );
        return;
      }
      if (browser.api_name === 'android') {
        write(browser.api_name, browser.short_version, browser.long_name, {
          browserName: +browser.short_version < 6 ? 'Browser' : 'Chrome',
          deviceName: browser.long_name,
          deviceOrientation: 'portrait',
          platformVersion: browser.short_version,
          platformName: 'Android',
        });
        return;
      }
      if (browser.api_name === 'ipad' || browser.api_name === 'iphone') {
        write('ios', browser.short_version, browser.device, {
          browserName: 'Safari',
          deviceName: browser.long_name,
          deviceOrientation: 'portrait',
          platformVersion: browser.short_version,
          platformName: 'iOS',
        });
        return;
      }
      if (
        (browser.api_name === 'chrome' ||
          browser.api_name === 'firefox' ||
          browser.api_name === 'safari') &&
        browser.os === 'Mac 10.8'
      ) {
        write(browser.api_name, browser.short_version, 'mountain_lion', {
          browserName: browser.api_name,
          platform: 'OS X 10.8',
          version: addDotZero(browser.short_version),
        });
        return;
      }
      if (
        (browser.api_name === 'chrome' ||
          browser.api_name === 'firefox' ||
          browser.api_name === 'safari') &&
        browser.os === 'Mac 10.9'
      ) {
        write(browser.api_name, browser.short_version, 'mavericks', {
          browserName: browser.api_name,
          platform: 'OS X 10.9',
          version: addDotZero(browser.short_version),
        });
        return;
      }
      if (
        (browser.api_name === 'chrome' ||
          browser.api_name === 'firefox' ||
          browser.api_name === 'safari') &&
        browser.os === 'Mac 10.10'
      ) {
        write(browser.api_name, browser.short_version, 'yosemite', {
          browserName: browser.api_name,
          platform: 'OS X 10.10',
          version: addDotZero(browser.short_version),
        });
        return;
      }
      if (
        (browser.api_name === 'chrome' ||
          browser.api_name === 'firefox' ||
          browser.api_name === 'safari') &&
        browser.os === 'Mac 10.11'
      ) {
        write(browser.api_name, browser.short_version, 'capitan', {
          browserName: browser.api_name,
          platform: 'OS X 10.11',
          version: addDotZero(browser.short_version),
        });
        return;
      }
      if (
        (browser.api_name === 'chrome' ||
          browser.api_name === 'firefox' ||
          browser.api_name === 'safari') &&
        browser.os === 'Mac 10.12'
      ) {
        write(browser.api_name, browser.short_version, 'sierra', {
          browserName: browser.api_name,
          platform: 'macOS 10.12',
          version: addDotZero(browser.short_version),
        });
        return;
      }
      if (
        (browser.api_name === 'internet explorer' ||
          browser.api_name === 'chrome' ||
          browser.api_name === 'firefox') &&
        browser.os === 'Windows 2003'
      ) {
        write(browser.api_name, browser.short_version, 'xp', {
          browserName: browser.api_name,
          platform: 'Windows XP',
          version: addDotZero(browser.short_version),
        });
        return;
      }
      if (browser.api_name === 'opera' && browser.os === 'Windows 2003') {
        write(browser.api_name, browser.short_version, 'xp', {
          browserName: browser.api_name,
          platform: 'Windows XP',
          version: browser.long_version.replace(/\.$/, ''),
        });
        return;
      }
      if (
        (browser.api_name === 'internet explorer' ||
          browser.api_name === 'chrome' ||
          browser.api_name === 'firefox') &&
        browser.os === 'Windows 2008'
      ) {
        write(browser.api_name, browser.short_version, 'win7', {
          browserName: browser.api_name,
          platform: 'Windows 7',
          version: addDotZero(browser.short_version),
        });
        return;
      }
      if (browser.api_name === 'opera' && browser.os === 'Windows 2008') {
        write(browser.api_name, browser.short_version, 'win7', {
          browserName: browser.api_name,
          platform: 'Windows 7',
          version: browser.long_version.replace(/\.$/, ''),
        });
        return;
      }
      if (
        browser.api_name === 'safari' &&
        browser.short_version === '5' &&
        browser.os === 'Windows 2008'
      ) {
        write(browser.api_name, '5.1', 'win7', {
          browserName: browser.api_name,
          platform: 'Windows 7',
          version: '5.1',
        });
        return;
      }
      if (
        (browser.api_name === 'internet explorer' ||
          browser.api_name === 'chrome' ||
          browser.api_name === 'firefox') &&
        browser.os === 'Windows 2012'
      ) {
        write(browser.api_name, browser.short_version, 'win8', {
          browserName: browser.api_name,
          platform: 'Windows 8',
          version: addDotZero(browser.short_version),
        });
        return;
      }
      if (
        (browser.api_name === 'internet explorer' ||
          browser.api_name === 'chrome' ||
          browser.api_name === 'firefox') &&
        browser.os === 'Windows 2012 R2'
      ) {
        write(browser.api_name, browser.short_version, 'win8', {
          browserName: browser.api_name,
          platform: 'Windows 8.1',
          version: addDotZero(browser.short_version),
        });
        return;
      }
      console.error('Unrecognised browser:');
      console.dir(browser);
      // process.exit(1);
    });
  })
  .done(() => {
    saveBrowsers(__dirname + '/../lib/sauce-labs.js', browsers);
  });
