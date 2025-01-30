import fs from 'node:fs/promises';
import { expect, test } from 'vitest';
import { FULL_RANGE_REGEX } from '../src/regexes';

test('it matches all colors', async () => {
  const testFilePath = 'tests/fixtures/regexes.html';

  const content = await fs.readFile(testFilePath, 'utf-8');

  const matches = [...content.matchAll(FULL_RANGE_REGEX)];

  expect(matches.length).toBe(19);

  const matchedPairs = matches.map((match) => [match[0], match.groups?.color]);

  expect(matchedPairs).toEqual([
    ['bg-gray-100', 'gray-100'],
    ['text-gray-900', 'gray-900'],
    ['bg-blue-600', 'blue-600'],
    ['text-white', 'white'],
    ['bg-gray-200', 'gray-200'],
    ['bg-gray-200', 'gray-200'],
    ['bg-gray-200', 'gray-200'],
    ['bg-gray-200', 'gray-200'],
    ['bg-white', 'white'],
    ['text-gray-700', 'gray-700'],
    ['bg-white', 'white'],
    ['text-gray-700', 'gray-700'],
    ['bg-white', 'white'],
    ['text-gray-700', 'gray-700'],
    ['bg-gray-200', 'gray-200'],
    ['bg-gray-800', 'gray-800'],
    ['text-white', 'white'],
    ['bg-blue-600', 'blue-600'],
    ['text-white', 'white'],
  ]);
});
