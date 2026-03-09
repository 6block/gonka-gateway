# Gonka AI Gateway Clone

This is a full-stack Nuxt 3 application that mimics the Gonka AI Gateway functionality.

## Features
- **String-based Login**: Simplified login/registration by just entering an ID/string.
- **Token Billing**: Users are given an initial balance of 100 GNK.
- **OpenAI-compatible Gateway**: Proxies requests to an upstream New API gateway, billing users per token.
- **Chat UI**: Built-in chat interface with streaming responses.
- **Dashboard**: Track token usage, API keys, and transaction history.

## Setup & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Initialize Database**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Environment Variables**:
   In `nuxt.config.ts` or via `.env`, configure the upstream New API token:
   ```env
   NEW_API_TOKEN=sk-OnkUYV0JCHqlveAlkTs88qm3ur0WoXExylBAHJu13cacjwlJ
   NEW_API_URL=http://36.189.234.197:18011/v1
   ```
   *(Note: The URL should point to your actual New API endpoint. Change `http://36.189.234.197:18011/v1` to your endpoint if different).*

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```

5. **Usage**:
   - Open `http://localhost:3000`
   - Enter any username to login.
   - Go to API Keys, generate a key.
   - Use the Chat tab to start chatting (it uses the generated key and deducts balance).
