import { access } from 'fs/promises';
import Color from 'colorjs.io';

export async function checkFileExists(filePath: string) {
  try {
    await access(filePath);
    return true; // File exists
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return false; // File does not exist
    }
    throw error; // Other errors (e.g., permission issues)
  }
}

// oklchString looks like this 'oklch(0.971 0.013 17.38)'
export function decomposeOklchString(oklchString: string) {
  const match = oklchString.match(/oklch\(([^ ]+) ([^ ]+) ([^ ]+)\)/);

  if (!match) {
    throw new Error(`Invalid oklch string: ${oklchString}`);
  }

  const [, l, c, h] = match;

  return {
    l: parseFloat(l),
    c: parseFloat(c),
    h: parseFloat(h),
  };
}

export function oklchToHex(l: number, c: number, h: number) {
  const color = new Color('oklch', [l, c, h]);
  return color.to('srgb').toString({ format: 'hex' });
}

export function isLightColor(l: number): boolean {
  return l > 0.6; // Adjust this threshold as needed
}

export function getContrastingBackground(l: number): string {
  return isLightColor(l) ? '#000000' : '#ffffff'; // Black for light colors, white for dark colors
}
