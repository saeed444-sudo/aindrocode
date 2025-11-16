# AIndroCode Backend

This is the backend server for AIndroCode IDE that handles code execution and AI integration.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your e2b API key to `.env`:
- Sign up at https://e2b.dev
- Get your API key
- Add to `.env`: `E2B_API_KEY=your_key_here`

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

## Deployment

### Heroku
```bash
heroku create aindrocode-backend
git push heroku main
heroku config:set E2B_API_KEY=your_key
```

### Railway
```bash
railway init
railway up
railway variables set E2B_API_KEY=your_key
```

### Render
1. Connect your GitHub repo
2. Set E2B_API_KEY in environment variables
3. Deploy

### VPS (DigitalOcean, AWS, etc.)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone your-repo
cd backend
npm install
npm install -g pm2

# Set environment variables
export E2B_API_KEY=your_key

# Start with PM2
pm2 start server.js --name aindrocode-backend
pm2 save
pm2 startup
```

## API Endpoints

### Execute Code
```
POST /api/execute/run
Body: {
  code: "console.log('Hello')",
  language: "javascript",
  input: "",
  files: []
}
```

### Run Terminal Command
```
POST /api/execute/command
Body: {
  command: "ls -la",
  cwd: "/",
  timeout: 30000
}
```

### Install Packages
```
POST /api/execute/install
Body: {
  packageManager: "npm",
  packages: ["express", "axios"]
}
```

### AI Generate Code
```
POST /api/ai/generate
Body: {
  prompt: "Create a React component",
  apiKey: "user_claude_api_key",
  context: "..."
}
```

### AI Fix Code
```
POST /api/ai/fix
Body: {
  code: "...",
  error: "...",
  language: "javascript",
  apiKey: "user_claude_api_key"
}
```

### AI Chat
```
POST /api/ai/chat
Body: {
  message: "How do I...",
  history: [],
  apiKey: "user_claude_api_key",
  context: "..."
}
```

## Supported Languages

- JavaScript/TypeScript (Node.js)
- Python (with pip)
- C/C++ (gcc/g++)
- Go
- Rust
- Java
- PHP
- Ruby
- Shell/Bash

## Features

- Full terminal command support (like Termux)
- Package installation (npm, pip, apt, cargo)
- Multi-language code execution
- AI-powered code generation and debugging
- Real-time output streaming
- File system support
- Timeout protection
- Error handling

## Security Notes

- User API keys are passed per-request, never stored
- e2b sandboxes are isolated and temporary
- All code runs in secure containers
- CORS configured for your frontend only
