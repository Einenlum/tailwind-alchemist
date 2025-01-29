import fs from 'fs';
import path from 'path';
import { ColorOccurrence } from './types';
import { TAILWIND_DEFAULT_COLORS, getTailwindColorRegex } from './regexes';

/**
 * Replaces all occurrences of a color class (e.g. "text-gray-800") with a new one (e.g. "text-foobar").
 */
export function replaceColor(
  occurrences: ColorOccurrence[],
  oldColorClass: string,
  newColorClass: string,
  dryRun: boolean,
) {
  // Make sure we only write each file once
  const visitedFiles = new Set<string>();

  for (const occ of occurrences) {
    const filePath = path.resolve(process.cwd(), occ.file);
    if (visitedFiles.has(filePath)) continue;
    visitedFiles.add(filePath);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    const regex = getTailwindColorRegex(oldColorClass);

    const matches = content.matchAll(regex);
    for (const match of matches) {
      const cls = match[0];

      const newCls = cls.replace(oldColorClass, newColorClass);

      content = content.replace(cls, newCls);
    }

    if (!dryRun) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(
        `Replaced "${oldColorClass}" => "${newColorClass}" in ${occ.file}`,
      );
    } else {
      console.log(
        `Would replace "${oldColorClass}" => "${newColorClass}" in ${occ.file}`,
      );
    }
  }

  return visitedFiles;
}
