import { execSync } from 'node:child_process'

export function runCommand(command: string, cwd?: string): void {
  execSync(command, { cwd, stdio: 'inherit' })
}
