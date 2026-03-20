# Gonka AI Gateway (Frontend)

This is a pure Nuxt 3 frontend application that serves as the user interface for the Gonka AI Gateway. It features a MetaMask-based SIWE (Sign-In with Ethereum) login flow and a real-time chat interface connected to an external AI API backend.

## Features

- **MetaMask SIWE Login**: Secure, passwordless authentication using Ethereum wallets and the SIWE standard.
- **Pure Frontend Architecture**: Fully decoupled frontend that interacts directly with the external backend API (`http://36.189.234.197:18013`).
- **Chat UI**: Built-in chat interface with SSE streaming support for seamless AI conversations.
- **Dashboard**: Displays user network status, connected wallet address, and provides API documentation and usage examples.

## Setup & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   In `nuxt.config.ts` or via `.env`, configure the upstream API Base URL (if different from the default):
   ```env
   API_BASE=http://36.189.234.197:18013
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

4. **Usage**:
   - Open `http://localhost:3000`
   - Click "Connect MetaMask" and sign the SIWE message to log in.
   - Use the Dashboard to view your connection status and API access examples.
   - Go to the Chat tab to start a conversation with the AI model.

## Tech Stack
- [Nuxt 3](https://nuxt.com/) (Vue 3)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pinia](https://pinia.vuejs.org/) for state management
- [SIWE](https://login.xyz/) & [Ethers.js](https://docs.ethers.org/) for Web3 authentication
