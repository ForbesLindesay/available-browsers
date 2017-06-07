'use strict';

const browsers = {
  browserstack: require('./browser-stack'),
  saucelabs: require('./sauce-labs'),
  testingbot: require('./testing-bot'),
};

function intersect(arrays) {
  return arrays
    .pop()
    .filter(value => arrays.every(otherArray => otherArray.includes(value)));
}

function getDefaultVersionNumber(browserName) {
  const versions = intersect(
    ['browserstack', 'saucelabs', 'testingbot'].map(remote =>
      Object.keys(browsers[remote][browserName]),
    ),
  );
  let maxVersion = -1;
  let maxVersionStr = '';
  for (let i = 0; i < versions.length; i++) {
    if (/^[0-9]/.test(versions[i])) {
      const v = +versions[i];
      if (v > maxVersion) {
        maxVersion = v;
        maxVersionStr = versions[i];
      }
    }
  }
  return maxVersionStr;
}

const defaultOS = {
  android: ['Android Emulator'],
  chrome: ['win10', 'win8.1', 'win8', 'win7'],
  edge: ['win10'],
  firefox: ['win10', 'win8.1', 'win8', 'win7'],
  ie: ['win10', 'win8.1', 'win8', 'win7'],
  ios: ['iPhone 6S', 'iPhone 6', 'iPhone 5S', 'iPhone 5', 'iPhone 4S'],
  opera: ['win10', 'win8.1', 'win8', 'win7'],
  safari: [
    'sierra',
    'capitan',
    'yosemite',
    'mavericks',
    'mountain_lion',
    'lion',
    'snow_leopard',
  ],
};

function getDefaultOS(browserName, versionNumber, optionalRemote) {
  let availableOperatingSystems = intersect(
    ['browserstack', 'saucelabs', 'testingbot']
      .filter(remote => browsers[remote][browserName][versionNumber])
      .map(remote => Object.keys(browsers[remote][browserName][versionNumber])),
  );
  if (availableOperatingSystems.length === 0 && optionalRemote) {
    availableOperatingSystems = Object.keys(
      browsers[optionalRemote][browserName][versionNumber],
    );
  }
  let operatingSystems = defaultOS[browserName];
  for (let i = 0; i < operatingSystems.length; i++) {
    if (availableOperatingSystems.indexOf(operatingSystems[i]) !== -1) {
      return operatingSystems[i];
    }
  }
  return availableOperatingSystems.sort()[0];
}

function getCapabilities(remoteName, browserName, versionNumber, os) {
  if (
    remoteName !== 'browserstack' &&
    remoteName !== 'saucelabs' &&
    remoteName !== 'testingbot'
  ) {
    const err = new Error(
      'Expected the remote to be one of "browserstack", "saucelabs" and "testingbot".',
    );
    throw err;
  }
  const remote = browsers[remoteName];
  if (!browserName) {
    browserName = 'chrome';
  }
  const browser = remote[browserName];
  if (!browser) {
    const err = new Error('Invalid browser name ' + browserName);
    throw err;
  }
  if (versionNumber == null) {
    versionNumber = getDefaultVersionNumber(browserName);
  }
  const version = browser[versionNumber];
  if (!os) {
    os = getDefaultOS(browserName, versionNumber, remote);
  }
  return version[os];
}

getCapabilities.browsers = browsers;
getCapabilities.getDefaultVersionNumber = getDefaultVersionNumber;
getCapabilities.getDefaultOS = getDefaultOS;

module.exports = getCapabilities;
