import { spawn, execSync } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 4000;
const HEALTH_URL = `http://localhost:${PORT}/healthz`;

console.log('================================================================================');
console.log('⚕️  MEDPULSE EHR — WEBDRIVERIO CUCUMBER TEST RUNNER');
console.log('================================================================================');

// Free port 4000 if stuck from a prior run
function freePortWindows(port) {
  if (process.platform !== 'win32') return;
  try {
    const out = execSync(`powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique)"`, { encoding: 'utf8' }).trim();
    if (out) {
      const pids = out.split(/\r?\n/).map(p => p.trim()).filter(Boolean);
      for (const pid of pids) {
        if (pid !== '0') {
          console.log(`⚠️  Clearing orphan process on port ${port} (PID: ${pid})...`);
          try { execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' }); } catch (e) {}
        }
      }
    }
  } catch (e) {}
}

function pollHealth(url, maxAttempts = 30, interval = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      attempts++;
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          return resolve(true);
        }
        retry();
      }).on('error', () => {
        retry();
      });
    };

    const retry = () => {
      if (attempts >= maxAttempts) {
        return reject(new Error(`Server failed to become healthy at ${url} after ${maxAttempts} attempts.`));
      }
      setTimeout(check, interval);
    };

    check();
  });
}

async function run() {
  freePortWindows(PORT);

  console.log(`🚀 Starting MedPulse Clinical Gateway on port ${PORT}...`);
  const serverProcess = spawn('node', ['app/server.js'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: Object.assign({}, process.env, { PORT: String(PORT) })
  });

  const cleanup = () => {
    console.log('\n🛑 Stopping background MedPulse Clinical Gateway...');
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill('SIGINT');
    }
  };

  process.on('SIGINT', () => { cleanup(); process.exit(1); });
  process.on('SIGTERM', () => { cleanup(); process.exit(1); });

  try {
    await pollHealth(HEALTH_URL);
    console.log(`✅ MedPulse Clinical Gateway is healthy at ${HEALTH_URL}!`);

    const rawArgs = process.argv.slice(2);
    const configFile = rawArgs.includes('--agent') 
      ? 'config/wdio.agent.conf.ts' 
      : 'config/wdio.headless.conf.ts';

    const wdioArgs = ['wdio', 'run', configFile, ...rawArgs.filter(a => a !== '--agent')];

    console.log(`⚡ Executing WebdriverIO: npx ${wdioArgs.join(' ')}\n`);

    const cmd = process.platform === 'win32' ? 'cmd.exe' : 'npx';
    const cmdArgs = process.platform === 'win32' ? ['/c', 'npx', ...wdioArgs] : wdioArgs;

    const wdioProcess = spawn(cmd, cmdArgs, {
      cwd: rootDir,
      stdio: 'inherit',
      env: Object.assign({}, process.env, { HEADLESS: 'true' })
    });

    wdioProcess.on('close', (code) => {
      cleanup();
      console.log('================================================================================');
      if (code === 0) {
        console.log('🎉 ALL WEBDRIVERIO CUCUMBER BDD TESTS PASSED SUCCESSFULLY (100%)');
      } else {
        console.log(`⚠️  WEBDRIVERIO TESTS COMPLETED WITH EXIT CODE: ${code}`);
      }
      console.log('================================================================================');
      process.exit(code);
    });
  } catch (err) {
    console.error('❌ Failed to launch or test MedPulse Gateway:', err.message);
    cleanup();
    process.exit(1);
  }
}

run();
