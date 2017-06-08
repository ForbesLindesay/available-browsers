import {writeFileSync} from 'fs';
import {inspect} from 'util';

function stringifyObject(obj) {
  if (obj && typeof obj === 'object') {
    return (
      '{' +
      Object.keys(obj)
        .sort()
        .map(key => `'${key}': ${stringifyObject(obj[key])}`)
        .join(', ') +
      '}'
    );
  }
  if (typeof obj === 'string') {
    return inspect(obj);
  }
  if (typeof obj === 'number') {
    return '' + obj;
  }
  throw new Error('Unknown object type ' + typeof obj);
}

export default function saveBrowsers(filename, browsers) {
  const src = Object.keys(browsers)
    .sort()
    .map(browserName => {
      return (
        `  '${browserName}': {\n` +
        Object.keys(browsers[browserName])
          .sort()
          .map(version => {
            return (
              `    '${version}': {\n` +
              Object.keys(browsers[browserName][version])
                .sort()
                .map(platform => {
                  return `      '${platform}': ${stringifyObject(
                    browsers[browserName][version][platform]
                  )},`;
                })
                .join('\n') +
              `\n    },`
            );
          })
          .join('\n') +
        `\n  },`
      );
    })
    .join('\n');
  writeFileSync(
    filename,
    "'use strict';\n\n// This file is auto-generated\n\n// prettier-ignore\nmodule.exports = {\n" +
      src +
      '\n};'
  );
}
