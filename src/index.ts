#!/usr/bin/env node

import { Command } from 'commander';
import { scanColors } from './scanner';
import { replaceColor } from './replacer';
import { printColorMap, newLineToAddInCss } from './output';
import { TAILWIND_DEFAULT_COLORS } from './regexes';
import { VerboseLevel, VERBOSE_LEVELS } from './types';

function getVerboseLevelFromOptions(
  verboseOption: boolean,
  extraVerboseOption: boolean,
): VerboseLevel {
  if (extraVerboseOption) {
    return VERBOSE_LEVELS.EXTRA_VERBOSE;
  }

  if (verboseOption) {
    return VERBOSE_LEVELS.VERBOSE;
  }

  return VERBOSE_LEVELS.NONE;
}

const program = new Command();
program
  .name('tw-alchemist')
  .description('Scan and replace Tailwind color classes in your project.');

program
  .command('scan')
  .description('Scan project for Tailwind color classes')
  .argument('[color]', 'Color to search for')
  .option(
    '-p, --pattern <glob...>',
    'All the glob patterns to scan for Tailwind color classes',
  )
  .option('-v, --verbose', 'Show files where the colors appear', false)
  .option(
    '-vv, --extra-verbose',
    'Show lines found in the files (only available with files option)',
    false,
  )
  .action(async (color: string | undefined, opts) => {
    let globs: string[];
    if (opts.pattern && opts.pattern.length > 0) {
      globs = opts.pattern;
    } else {
      console.error('No file patterns provided.');

      process.exit(1);
    }

    if (globs.length === 0) {
      console.error('No file patterns found. Aborting.');
      process.exit(1);
    }

    const verboseLevel = getVerboseLevelFromOptions(
      opts.verbose,
      opts.extraVerbose,
    );

    // Scan and print
    const colorMap = await scanColors(globs, color);
    printColorMap(colorMap, verboseLevel);
  });

program
  .command('replace <oldColorClass> <newColorClass>')
  .description(
    'Replace all occurrences of <oldColorClass> with <newColorClass>',
  )
  .option(
    '-p, --pattern <glob...>',
    'All the glob patterns to scan for Tailwind color classes',
  )
  .option('--dry-run', 'Do not write changes to files', false)
  .action(async (oldColorClass, newColorClass, opts) => {
    let globs: string[];
    if (opts.pattern && opts.pattern.length > 0) {
      globs = opts.pattern;
    } else {
      console.error('No file patterns provided.');

      process.exit(1);
    }

    if (globs.length === 0) {
      console.error('No file patterns provided.');

      process.exit(1);
    }

    const colorMap = await scanColors(globs, oldColorClass);

    // Replace and update config
    const visitedFiles = replaceColor(
      colorMap[oldColorClass] ?? [],
      oldColorClass,
      newColorClass,
      opts.dryRun,
    );

    if (visitedFiles.size === 0) {
      console.log(`No files were updated.`);

      return;
    }

    console.log(
      opts.dryRun
        ? `Would update ${visitedFiles.size} files:`
        : `Updated ${visitedFiles.size} files:`,
    );

    for (const file of visitedFiles) {
      console.log(`  - ${file}`);
    }

    if (!(newColorClass in TAILWIND_DEFAULT_COLORS)) {
      console.log(newLineToAddInCss(oldColorClass, newColorClass, opts.dryRun));
    }
  });

program.parse(process.argv);
