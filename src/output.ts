import chalk from 'chalk';

import {
  ColorMap,
  ColorOccurrence,
  VerboseLevel,
  VERBOSE_LEVELS,
} from './types';
import { TAILWIND_DEFAULT_COLORS } from './regexes';

function groupBy<T, K extends keyof any>(
  array: T[],
  keyExtractor: (item: T) => K,
): Record<K, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyExtractor(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}

function showSimpleColors(colorMap: ColorMap) {
  const found = Object.keys(colorMap);

  found.sort();

  console.log(`Found ${chalk.yellow.bold(found.length)} Tailwind colors:\n`);

  for (const color of found) {
    console.log(color);
  }
}

function showColorWithLines(colorMap: ColorMap) {
  const found = Object.keys(colorMap);

  console.log(`Found ${chalk.yellow.bold(found.length)} Tailwind colors:\n`);

  for (const color of found) {
    const occurrences = colorMap[color];

    const grouped = groupBy(
      occurrences,
      (occurence: ColorOccurrence) => occurence.file,
    );

    console.log(
      `\nColor: ${color} (${chalk.yellow.bold(occurrences.length)} occurrence${occurrences.length > 1 ? 's' : ''})`,
    );

    for (const [file, results] of Object.entries(grouped)) {
      console.log(`  - ${chalk.yellow(file)}`);
      for (const result of results) {
        console.log(`    - Line ${result.line}: ${result.match}`);
      }
    }
  }
}

function showColorWithFiles(colorMap: ColorMap) {
  const found = Object.keys(colorMap);

  console.log(`Found ${chalk.yellow.bold(found.length)} Tailwind colors:\n`);

  for (const color of found) {
    const files = colorMap[color].map((occurrence) => occurrence.file);
    const uniqueFiles = new Set(files);

    console.log(
      `\nColor: ${color} (found in ${chalk.yellow.bold(uniqueFiles.size)} file${uniqueFiles.size > 1 ? 's' : ''})`,
    );

    for (const file of uniqueFiles) {
      console.log(`  - ${file}`);
    }
  }
}

/**
 * Helper function to pretty-print the color usage results.
 */
export function printColorMap(colorMap: ColorMap, verboseLevel: VerboseLevel) {
  const classesFound = Object.keys(colorMap);
  if (classesFound.length === 0) {
    console.log('No Tailwind color classes found.');
    return;
  }

  if (verboseLevel === VERBOSE_LEVELS.EXTRA_VERBOSE) {
    showColorWithLines(colorMap);

    return;
  }

  if (verboseLevel === VERBOSE_LEVELS.VERBOSE) {
    showColorWithFiles(colorMap);
    return;
  }

  showSimpleColors(colorMap);
}

export function newLineToAddInCss(
  oldColorClass: string,
  newColorClass: string,
  dryRun: boolean,
) {
  const oklchValue =
    TAILWIND_DEFAULT_COLORS[
      oldColorClass as keyof typeof TAILWIND_DEFAULT_COLORS
    ] ?? null;

  const prefixText = dryRun
    ? '\nYou would then add this to your CSS file:'
    : '\nYou now must add this to your CSS file:';

  const cssTheme = `@theme {
    /* ... */
    --color-${newColorClass}: ${oklchValue ?? '<value>'};
}`;

  return (
    prefixText +
    `

${chalk.yellow(cssTheme)}
`
  );
}
