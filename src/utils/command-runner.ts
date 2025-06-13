import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

export class CommandRunner {
  static async runCommand(command: string, cwd: string = process.cwd()) {
    try {
      const { stdout, stderr } = await execPromise(command, { cwd });
      return {
        success: true,
        output: stdout.split('~~~')[1].trim(),
        error: stderr
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: error.stdout || '',
        stderr: error.stderr || ''
      };
    }
  }
}
