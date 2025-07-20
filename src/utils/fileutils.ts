import fs from 'fs';
import path from 'path';

export const readJson = <T>(filePath: string): T[] => {
  const fullPath = path.join(__dirname, '../../data', filePath);
  if (!fs.existsSync(fullPath)) return [];
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
};

export const writeJson = <T>(filePath: string, data: T[]): void => {
  const fullPath = path.join(__dirname, '../../data', filePath);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
};
