import { exec } from 'child_process';

console.log('Starting TypeScript build...');

exec('tsc', (err, stdout, stderr) => {
  if (err) {
    console.error(`Build failed: ${stderr}`);
    process.exit(1);
  }
  console.log('TypeScript build completed!');
  console.log(stdout);
});