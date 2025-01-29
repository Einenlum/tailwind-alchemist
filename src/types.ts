export interface ColorOccurrence {
  file: string;
  line: number;
  match: string;
  color: string;
}

export interface ColorMap {
  [color: string]: ColorOccurrence[];
}

export const VERBOSE_LEVELS = {
  NONE: 0,
  VERBOSE: 1,
  EXTRA_VERBOSE: 2,
} as const;

export type VerboseLevel = (typeof VERBOSE_LEVELS)[keyof typeof VERBOSE_LEVELS];
