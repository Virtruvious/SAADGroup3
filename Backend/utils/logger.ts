// Create a new file: utils/logger.ts
import fs from 'fs';
import path from 'path';

export const logToFile = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `\n[${timestamp}] ${message}`;
  //create logs folder if it doesn't exist
  if (!fs.existsSync(path.join(process.cwd(), 'logs'))) {
    fs.mkdirSync(path.join(process.cwd(), 'logs'));
  }
  fs.appendFileSync(path.join(process.cwd(), 'logs', 'debug.log'), logMessage); //saves in logs/debug.log

};