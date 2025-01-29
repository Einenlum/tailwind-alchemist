#!/usr/bin/env node

import yargs from 'yargs';
import chalk from 'chalk';
import { hideBin } from 'yargs/helpers';
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

// Manually parse `-vv` and map it to `--extra-verbose`
const rawArgs = hideBin(process.argv);
const parsedArgs = rawArgs.map((arg) => {
  if (arg === '-vv') {
    return '--extra-verbose';
  }
  return arg;
});

yargs(parsedArgs)
  .scriptName('tw-alchemist')
  .usage('$0 <command> [options]')
  .command(
    'scan [color]',
    'Scan project for Tailwind color classes',
    (yargs) => {
      return yargs
        .positional('color', {
          type: 'string',
          description: 'Color to search for',
        })
        .option('pattern', {
          alias: 'p',
          type: 'array',
          description:
            'All the glob patterns to scan for Tailwind color classes',
          demandOption: true,
        })
        .option('verbose', {
          alias: 'v',
          type: 'boolean',
          description: 'Show files where the colors appear',
          default: false,
        })
        .option('extra-verbose', {
          type: 'boolean',
          description:
            'Show lines found in the files (only available with files option)',
          default: false,
        });
    },
    async (argv) => {
      const { color, pattern, verbose, extraVerbose } = argv;

      if (!pattern || pattern.length === 0) {
        console.error('No file patterns provided.');
        process.exit(1);
      }

      const verboseLevel = getVerboseLevelFromOptions(verbose, extraVerbose);

      // Scan and print
      const colorMap = await scanColors(pattern as string[], color);
      printColorMap(colorMap, verboseLevel);
    },
  )
  .command(
    'replace <oldColorClass> <newColorClass>',
    'Replace all occurrences of <oldColorClass> with <newColorClass>',
    (yargs) => {
      return yargs
        .positional('oldColorClass', {
          type: 'string',
          description: 'The old color class to replace',
        })
        .positional('newColorClass', {
          type: 'string',
          description: 'The new color class to use',
        })
        .option('pattern', {
          alias: 'p',
          type: 'array',
          description:
            'All the glob patterns to scan for Tailwind color classes',
          demandOption: true,
        })
        .option('dry-run', {
          type: 'boolean',
          description: 'Do not write changes to files',
          default: false,
        });
    },
    async (argv) => {
      const { oldColorClass, newColorClass, pattern, dryRun } = argv as {
        oldColorClass: string;
        newColorClass: string;
        pattern: string[];
        dryRun: boolean;
      };

      if (!pattern || pattern.length === 0) {
        console.error('No file patterns provided.');
        process.exit(1);
      }

      const colorMap = await scanColors(pattern as string[], oldColorClass);

      // Replace and update config
      const visitedFiles = await replaceColor(
        colorMap[oldColorClass] ?? [],
        oldColorClass,
        newColorClass,
        dryRun,
      );

      if (visitedFiles.size === 0) {
        console.log('No files were updated.');
        return;
      }

      console.log(
        dryRun
          ? `\nWould update ${chalk.yellow.bold(visitedFiles.size)} file${visitedFiles.size > 1 ? 's' : ''}:`
          : `\nUpdated ${chalk.yellow.bold(visitedFiles.size)} file${visitedFiles.size > 1 ? 's' : ''}:`,
      );

      for (const file of visitedFiles) {
        console.log(`  - ${chalk.yellow(file)}`);
      }

      if (!(newColorClass in TAILWIND_DEFAULT_COLORS)) {
        console.log(newLineToAddInCss(oldColorClass, newColorClass, dryRun));
      }
    },
  )
  .demandCommand(1, 'You need to specify a command.')
  .strict()
  .help()
  .parse();
