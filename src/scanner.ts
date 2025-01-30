import fs from 'node:fs/promises';
import path from 'node:path';

import fg from 'fast-glob';

import { checkFileExists } from './utils';

import {
  FULL_RANGE_REGEX as fullRangeRegex,
  getTailwindColorRegex,
} from './regexes';
import { ColorMap, ColorOccurrence } from './types';

export async function scanFile(
  filePath: string,
  regex: RegExp,
): Promise<ColorOccurrence[]> {
  if (!(await checkFileExists(filePath))) {
    return [];
  }

  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');

  const occurrences: ColorOccurrence[] = [];

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

      occurrences.push({
        file: path.relative(process.cwd(), filePath),
        line: index + 1,
        match: colorClass,
        color: color,
      });
    }
  });

  return occurrences;
}

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
    const occurrences = await scanFile(file, regex);

    for (const occurrence of occurrences) {
      if (!colorMap[occurrence.color]) {
        colorMap[occurrence.color] = [];
      }

      colorMap[occurrence.color].push(occurrence);
    }
  }

  return colorMap;
}
