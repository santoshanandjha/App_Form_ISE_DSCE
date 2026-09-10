import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting AMS Project Services...\n');

// Start Backend
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'Backend'),
  shell: true,
  stdio: 'pipe',
  env: { ...process.env }
});

backend.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[Backend ERR] ${data.toString().trim()}`);
});

// Start Frontend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'Frontend'),
  shell: true,
  stdio: 'pipe',
  env: { ...process.env }
});

frontend.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data.toString().trim()}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`[Frontend ERR] ${data.toString().trim()}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down services...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

setTimeout(() => {
  console.log('\n==================================================');
  console.log('🎉 AMS Project is up and running!');
  console.log('🌐 Frontend Web Link:  http://localhost:5173');
  console.log('⚙️  Backend API Link:   http://localhost:9000');
  console.log('==================================================\n');
}, 3000);
