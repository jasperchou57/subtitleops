import { spawn } from 'node:child_process';
import { unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const generatedDevVars = fileURLToPath(
  new URL('../dist/server/.dev.vars', import.meta.url)
);

async function removeGeneratedDevVars() {
  await unlink(generatedDevVars).catch((error) => {
    if (error?.code !== 'ENOENT') throw error;
  });
}

await removeGeneratedDevVars();

const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const vite = spawn(command, ['exec', 'vite', 'build'], {
  env: process.env,
  stdio: 'inherit',
});

const exitCode = await new Promise((resolve, reject) => {
  vite.once('error', reject);
  vite.once('close', (code) => resolve(code ?? 1));
});

await removeGeneratedDevVars();
process.exitCode = exitCode;
