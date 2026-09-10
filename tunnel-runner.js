import { spawn } from 'child_process';
import fs from 'fs';

function startTunnel() {
  console.log('🚀 Starting Cloudflare Tunnel on port 9000...');
  const command = fs.existsSync('./cloudflared') ? './cloudflared' : 'npx';
  const args = fs.existsSync('./cloudflared') 
    ? ['tunnel', '--url', 'http://localhost:9000']
    : ['-y', 'localtunnel', '--port', '9000', '--subdomain', 'ams-dsce-backend'];

  const tunnel = spawn(command, args, {
    shell: true,
    stdio: 'pipe'
  });

  tunnel.stdout.on('data', (data) => {
    const text = data.toString().trim();
    console.log(`[TUNNEL] ${text}`);
    if (text.includes('trycloudflare.com') || text.includes('your url is:')) {
      const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/) || text.match(/https:\/\/[a-zA-Z0-9-]+\.loca\.lt/);
      if (match) {
        const url = match[0];
        fs.writeFileSync('.current_tunnel_url', url);
        console.log(`\n==================================================`);
        console.log(`🌐 LIVE BACKEND API URL: ${url}/app`);
        console.log(`==================================================\n`);
      }
    }
  });

  tunnel.stderr.on('data', (data) => {
    const text = data.toString().trim();
    console.log(`[TUNNEL LOG] ${text}`);
    if (text.includes('trycloudflare.com')) {
      const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
      if (match) {
        const url = match[0];
        fs.writeFileSync('.current_tunnel_url', url);
        console.log(`\n==================================================`);
        console.log(`🌐 LIVE BACKEND API URL: ${url}/app`);
        console.log(`==================================================\n`);
      }
    }
  });

  tunnel.on('close', (code) => {
    console.warn(`⚠️ Tunnel process exited with code ${code}. Auto-restarting in 2 seconds...`);
    setTimeout(startTunnel, 2000);
  });
}

startTunnel();
