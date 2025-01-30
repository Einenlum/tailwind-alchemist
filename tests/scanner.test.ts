import { expect, test } from 'vitest';
import { scanFile } from '../src/scanner';
import { FULL_RANGE_REGEX } from '../src/regexes';

test('it finds all colors in file 1', async () => {
  const filePath = 'tests/fixtures/scanner/file1.html';

  const occurrences = await scanFile(filePath, FULL_RANGE_REGEX);

  const expected = [
    { line: 12, match: 'bg-gray-50', color: 'gray-50' },
    { line: 12, match: 'text-gray-800', color: 'gray-800' },
    { line: 14, match: 'bg-white', color: 'white' },
    { line: 16, match: 'text-indigo-600', color: 'indigo-600' },
    { line: 17, match: 'text-gray-900', color: 'gray-900' },
    { line: 22, match: 'text-gray-600', color: 'gray-600' },
    { line: 22, match: 'hover:text-indigo-600', color: 'indigo-600' },
    { line: 27, match: 'text-gray-600', color: 'gray-600' },
    { line: 27, match: 'hover:text-indigo-600', color: 'indigo-600' },
    { line: 32, match: 'bg-indigo-600', color: 'indigo-600' },
    { line: 32, match: 'text-white', color: 'white' },
    { line: 32, match: 'hover:bg-indigo-700', color: 'indigo-700' },
    { line: 41, match: 'from-indigo-500', color: 'indigo-500' },
    { line: 41, match: 'to-indigo-600', color: 'indigo-600' },
    { line: 41, match: 'text-white', color: 'white' },
    { line: 52, match: 'bg-white', color: 'white' },
    { line: 52, match: 'text-indigo-600', color: 'indigo-600' },
    { line: 52, match: 'hover:bg-gray-200', color: 'gray-200' },
    { line: 63, match: 'text-gray-800', color: 'gray-800' },
    { line: 66, match: 'text-gray-600', color: 'gray-600' },
    { line: 73, match: 'bg-white', color: 'white' },
    { line: 74, match: 'text-indigo-600', color: 'indigo-600' },
    { line: 78, match: 'text-gray-600', color: 'gray-600' },
    { line: 85, match: 'bg-white', color: 'white' },
    { line: 86, match: 'text-indigo-600', color: 'indigo-600' },
    { line: 90, match: 'text-gray-600', color: 'gray-600' },
    { line: 97, match: 'bg-white', color: 'white' },
    { line: 98, match: 'text-indigo-600', color: 'indigo-600' },
    { line: 102, match: 'text-gray-600', color: 'gray-600' },
    { line: 109, match: 'bg-white', color: 'white' },
    { line: 110, match: 'text-indigo-600', color: 'indigo-600' },
    { line: 114, match: 'text-gray-600', color: 'gray-600' },
    { line: 121, match: 'bg-white', color: 'white' },
    { line: 122, match: 'text-indigo-600', color: 'indigo-600' },
    { line: 126, match: 'text-gray-600', color: 'gray-600' },
    { line: 133, match: 'bg-white', color: 'white' },
    { line: 134, match: 'text-indigo-600', color: 'indigo-600' },
    { line: 138, match: 'text-gray-600', color: 'gray-600' },
    { line: 148, match: 'bg-gray-100', color: 'gray-100' },
    { line: 151, match: 'text-gray-800', color: 'gray-800' },
    { line: 154, match: 'text-gray-600', color: 'gray-600' },
    { line: 161, match: 'bg-white', color: 'white' },
    { line: 162, match: 'text-gray-600', color: 'gray-600' },
    { line: 174, match: 'text-gray-800', color: 'gray-800' },
    { line: 175, match: 'text-gray-500', color: 'gray-500' },
    { line: 180, match: 'bg-white', color: 'white' },
    { line: 181, match: 'text-gray-600', color: 'gray-600' },
    { line: 192, match: 'text-gray-800', color: 'gray-800' },
    { line: 193, match: 'text-gray-500', color: 'gray-500' },
    { line: 202, match: 'bg-indigo-600', color: 'indigo-600' },
    { line: 202, match: 'text-white', color: 'white' },
    { line: 214, match: 'bg-white', color: 'white' },
    { line: 214, match: 'text-indigo-600', color: 'indigo-600' },
    { line: 214, match: 'hover:bg-gray-200', color: 'gray-200' },
    { line: 222, match: 'bg-gray-800', color: 'gray-800' },
    { line: 222, match: 'text-gray-300', color: 'gray-300' },
    { line: 226, match: 'text-indigo-500', color: 'indigo-500' },
    { line: 231, match: 'text-indigo-400', color: 'indigo-400' },
    { line: 231, match: 'hover:text-indigo-300', color: 'indigo-300' },
  ];

  expect(occurrences).toEqual(
    expected.map((occurrence) => ({ file: filePath, ...occurrence })),
  );
});

test('it finds all colors in file 2', async () => {
  const filePath = 'tests/fixtures/scanner/file2.html';

  const occurrences = await scanFile(filePath, FULL_RANGE_REGEX);

  const expected = [
    { line: 1, match: 'bg-white', color: 'white' },
    { line: 1, match: 'dark:bg-gray-800', color: 'gray-800' },
    { line: 1, match: 'border-gray-100', color: 'gray-100' },
    { line: 1, match: 'dark:border-gray-700', color: 'gray-700' },
    { line: 9, match: 'text-gray-800', color: 'gray-800' },
    { line: 9, match: 'dark:text-gray-200', color: 'gray-200' },
    { line: 25, match: 'text-gray-500', color: 'gray-500' },
    { line: 25, match: 'dark:text-gray-400', color: 'gray-400' },
    { line: 25, match: 'bg-white', color: 'white' },
    { line: 25, match: 'dark:bg-gray-800', color: 'gray-800' },
    { line: 25, match: 'hover:text-gray-700', color: 'gray-700' },
    { line: 25, match: 'dark:hover:text-gray-300', color: 'gray-300' },
    { line: 57, match: 'text-gray-400', color: 'gray-400' },
    { line: 57, match: 'dark:text-gray-500', color: 'gray-500' },
    { line: 57, match: 'hover:text-gray-500', color: 'gray-500' },
    { line: 57, match: 'dark:hover:text-gray-400', color: 'gray-400' },
    { line: 57, match: 'hover:bg-gray-100', color: 'gray-100' },
    { line: 57, match: 'dark:hover:bg-gray-900', color: 'gray-900' },
    { line: 57, match: 'focus:bg-gray-100', color: 'gray-100' },
    { line: 57, match: 'dark:focus:bg-gray-900', color: 'gray-900' },
    { line: 57, match: 'focus:text-gray-500', color: 'gray-500' },
    { line: 57, match: 'dark:focus:text-gray-400', color: 'gray-400' },
    { line: 76, match: 'border-gray-200', color: 'gray-200' },
    { line: 76, match: 'dark:border-gray-600', color: 'gray-600' },
    { line: 78, match: 'text-gray-800', color: 'gray-800' },
    { line: 78, match: 'dark:text-gray-200', color: 'gray-200' },
    { line: 79, match: 'text-gray-500', color: 'gray-500' },
  ];

  expect(occurrences).toEqual(
    expected.map((occurrence) => ({ file: filePath, ...occurrence })),
  );
});
