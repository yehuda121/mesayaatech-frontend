# Mesayaatech Frontend

Next.js 15 client for the Mesayaatech platform.

**Full documentation** (architecture, AWS reconnection, environment variables, security): see the [root README](../README.md).

## Quick start

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

The UI runs without AWS, but API features require a configured backend (`NEXT_PUBLIC_API_BASE`).
