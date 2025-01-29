import fs from 'node:fs/promises';
import path from 'node:path';

import fg from 'fast-glob';

import { checkFileExists } from './utils';

import {
  FULL_RANGE_REGEX as fullRangeRegex,
  getTailwindColorRegex,
} from './regexes';
import { ColorMap } from './types';

/**
 * Scan an array of file patterns
 * and return a map of colorClass -> array of occurrences.
 */
export async function scanColors(
  globs: string[],
  color: string | undefined,
): Promise<ColorMap> {
  // 1. Use fast-glob to expand all patterns into a unique file list
  const files = await fg(globs, { dot: true });
  const colorMap: ColorMap = {};

  const regex = color ? getTailwindColorRegex(color) : fullRangeRegex;

  // 2. For each file, read line by line, match our regex, record the occurrences
  for (const file of files) {
    if (!(await checkFileExists(file))) {
      continue;
    }
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Match all color classes on this line
      const matches = line.matchAll(regex);
      for (const match of matches) {
        // match[0] is the entire matched string (e.g. "hover:text-red-500")
        const colorClass = match[0];
        const color = match.groups?.color;

        if (!color) {
          continue;
        }

        // If we haven't seen this colorClass yet, initialize
        if (!colorMap[color]) {
          colorMap[color] = [];
        }

        colorMap[color].push({
          file: path.relative(process.cwd(), file),
          line: index + 1,
          match: colorClass,
          color: color,
        });
      }
    });
  }

  return colorMap;
}
