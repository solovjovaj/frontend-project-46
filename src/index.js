import _ from 'lodash';
import { readFileSync } from 'node:fs';
import path from 'path';

const makeParse = (filepath) => {
    return JSON.parse(readFileSync(path.resolve(filepath), 'utf-8'));
};

const genDiff = (filepath1, filepath2) => {
  if (!filepath1.endsWith('json') || !filepath2.endsWith('json')) {
    return 'Error: file is not .json extension';
  }
  const file1 = makeParse(filepath1);
  const file2 = makeParse(filepath2);
  const sortedAllKeys = _.union(_.keys(file1), _.keys(file2)).sort();
  const result = sortedAllKeys.reduce((diff, key) => {
    if (!Object.hasOwn(file1, key)) {
      diff = `${diff}\n  + ${key}: ${file2[key]}`;
      return diff;
    }
    if (!Object.hasOwn(file2, key)) {
      diff = `${diff}\n  - ${key}: ${file1[key]}`;
      return diff;
    }
    if (file1[key] !== file2[key]) {
      diff = `${diff}\n  - ${key}: ${file1[key]}\n  + ${key}: ${file2[key]}`;
      return diff;
    }
    diff = `${diff}\n    ${key}: ${file1[key]}`;
    return diff;
  }, '');
  return `{${result}\n}`;
};

export default genDiff;
