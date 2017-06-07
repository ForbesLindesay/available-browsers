const getCapabilities = require('../');
const {browsers} = require('../');

test('browserstack', () => {
  expect(getCapabilities('browserstack', 'chrome')).toMatchSnapshot();
});

test('saucelabs', () => {
  expect(getCapabilities('saucelabs', 'chrome')).toMatchSnapshot();
});

test('testingbot', () => {
  expect(getCapabilities('testingbot', 'chrome')).toMatchSnapshot();
});

test('browsers', () => {
  const remotes = Object.keys(browsers);
  const browserCount = {};
  const expectedBrowsers = [];
  remotes.forEach(remote => {
    Object.keys(browsers[remote]).forEach(browserName => {
      browserCount[browserName] = browserCount[browserName] || 0;
      browserCount[browserName]++;
      if (
        browserCount[browserName] > 1 &&
        !expectedBrowsers.includes(browserName)
      ) {
        expectedBrowsers.push(browserName);
      }
    });
  });

  remotes.forEach(remote => {
    expect(
      Object.keys(browsers[remote])
        .filter(browserName => {
          return browserCount[browserName] === 1;
        })
        .map(browserName => ({
          type: 'add',
          browserName,
        }))
        .concat(
          expectedBrowsers
            .filter(browserName => !browsers[remote][browserName])
            .map(browserName => ({
              type: 'remove',
              browserName,
            })),
        )
        .sort((a, b) => (a.browserName < b.browserName ? 1 : -1))
        .map(b => (b.type === 'add' ? ' + ' : ' - ') + b.browserName)
        .join('\n'),
    ).toMatchSnapshot(remote + ' browser diff');
  });
});
