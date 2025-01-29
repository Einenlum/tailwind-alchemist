import { access } from 'fs/promises';

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
