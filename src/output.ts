import chalk from 'chalk';

import {
  ColorMap,
  ColorOccurrence,
  VerboseLevel,
  VERBOSE_LEVELS,
} from './types';
import { TAILWIND_DEFAULT_COLORS } from './regexes';
import {
  decomposeOklchString,
  oklchToHex,
  isLightColor,
  getContrastingBackground,
} from './utils';

export function highlightNumber(value: string | number) {
  return chalk.yellow.bold(value);
}

function getColorChalk(colorClass: string) {
  const oklchValue =
    TAILWIND_DEFAULT_COLORS[
      colorClass as keyof typeof TAILWIND_DEFAULT_COLORS
    ] ?? null;

  if (!oklchValue) {
    return chalk.gray;
  }

  if (oklchValue) {
    try {
      // if oklchValue starts with #
      if (oklchValue.startsWith('#')) {
        const hex = oklchValue;
        const bgHex = hex.replace('#', '#99');
        return chalk.hex(hex).bgHex(bgHex);
      }

      const { l, c, h } = decomposeOklchString(oklchValue);
      const hex = oklchToHex(l, c, h);

      return chalk.bgHex(getContrastingBackground(l)).hex(hex);
    } catch (error) {
      return chalk.gray;
    }
  }

  return chalk.bgGray;
}

export function printColor(color: string) {
  const colorChalk = getColorChalk(color);

  return colorChalk(color);
}

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

  console.log(`Found ${highlightNumber(found.length)} Tailwind colors:\n`);

  for (const color of found) {
    console.log(printColor(color));
  }
}

function showColorWithLines(colorMap: ColorMap) {
  const found = Object.keys(colorMap);

  console.log(`Found ${highlightNumber(found.length)} Tailwind colors:\n`);

  for (const color of found) {
    const occurrences = colorMap[color];

    const grouped = groupBy(
      occurrences,
      (occurence: ColorOccurrence) => occurence.file,
    );

    console.log(
      `\nColor: ${printColor(color)} (${highlightNumber(occurrences.length)} occurrence${occurrences.length > 1 ? 's' : ''})`,
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

  console.log(`Found ${highlightNumber(found.length)} Tailwind colors:\n`);

  for (const color of found) {
    const files = colorMap[color].map((occurrence) => occurrence.file);
    const uniqueFiles = new Set(files);

    console.log(
      `\nColor: ${printColor(color)} (found in ${highlightNumber(uniqueFiles.size)} file${uniqueFiles.size > 1 ? 's' : ''})`,
    );

    for (const file of uniqueFiles) {
      console.log(`  - ${chalk.yellow(file)}`);
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
  const isNativeColor = oldColorClass in TAILWIND_DEFAULT_COLORS;

  const oklchValue = isNativeColor
    ? TAILWIND_DEFAULT_COLORS[
        oldColorClass as keyof typeof TAILWIND_DEFAULT_COLORS
      ]
    : null;

  const prefixText = dryRun
    ? '\nYou would then add this to your CSS file:'
    : '\nYou now must add this to your CSS file:';

  const cssTheme = `@theme {
    /* ... */
    --color-${newColorClass}: ${oklchValue ?? '<value>'};
`;

  let finalCssTheme = cssTheme;

  if (isNativeColor) {
    finalCssTheme =
      cssTheme +
      `    /* or */
    --color-${newColorClass}: var(--color-${oldColorClass});
`;
  }

  finalCssTheme = finalCssTheme + '}';

  return (
    prefixText +
    `

${chalk.yellow(finalCssTheme)}`
  );
}
