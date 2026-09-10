import { spawn } from 'child_process';
import fs from 'fs';

function startTunnel() {
  console.log('🚀 Starting Localtunnel on port 9000...');
  const tunnel = spawn('npx', ['-y', 'localtunnel', '--port', '9000'], {
    shell: true,
    stdio: 'pipe'
  });

  tunnel.stdout.on('data', (data) => {
    const text = data.toString().trim();
    console.log(`[TUNNEL] ${text}`);
    if (text.includes('your url is:')) {
      const url = text.split('your url is:')[1].trim();
      fs.writeFileSync('.current_tunnel_url', url);
      console.log(`\n==================================================`);
      console.log(`🌐 LIVE BACKEND API URL: ${url}/app`);
      console.log(`==================================================\n`);
    }
  });

  tunnel.stderr.on('data', (data) => {
    console.error(`[TUNNEL ERR] ${data.toString().trim()}`);
  });

  tunnel.on('close', (code) => {
    console.warn(`⚠️ Tunnel process exited with code ${code}. Auto-restarting in 2 seconds...`);
    setTimeout(startTunnel, 2000);
  });
}

startTunnel();
