require('dotenv').config({ path: '.env' });
const { spawn } = require('child_process');

console.log('✅ Environment loaded. MONGODB_URI exists:', !!process.env.MONGODB_URI);

// Start Next.js dev server
spawn('npm', ['run', 'next-dev'], { stdio: 'inherit', shell: true });