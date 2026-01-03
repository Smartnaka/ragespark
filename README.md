# RageSpark — The Provocateur's Toolkit

RageSpark is a small single‑page application (React + TypeScript + Vite) that helps creators brainstorm high‑engagement, provocative social posts ("ragebait") using AI-driven prompts and a set of engagement techniques. The app includes a Generator (AI-driven content output) and an Academy (short, copyable tactical lessons such as Cunningham's Law, gatekeeping, and the culinary offense).

This README explains what the app does, how the code is organized, how to run it locally, and important safety/security guidance — please read the Security & Ethics section before running or deploying.

Metadata (from metadata.json)
- name: RageSpark: The Provocateur's Toolkit
- description: An advanced engagement-focused application designed to help creators generate "ragebait" and provocative content through psychological triggers and AI-driven brainstorming, featuring built-in tutorials on engagement-hacking.

Table of contents
- About
- Quick start
- Project structure
- How the generator works
- Switching AI providers
- Development
- Security & ethics (important)
- Recommended fixes (immediate)
- Contributing & license
- Contact

About
-----
RageSpark is a front-end prototype that demonstrates how an AI model can be guided to produce short, high‑engagement social hooks plus an explanation of the strategy and the psychology behind them. It ships with:

- A small tutorial "Academy" (constants.tsx) with engagement techniques.
- A Generator UI (App.tsx) where users enter a topic, choose a heat level and platform, and request generated content.
- Two service implementations that show how the app can call different AI backends:
  - services/geminiService.ts — uses @google/genai (Gemini) and a JSON response schema.
  - services/openaiService.ts — demonstrates a direct OpenAI API call (note: this file currently contains an inline API key — see Security & ethics below).

Quick start
-----------
Requirements
- Node.js (recommended >= 18)
- npm (or pnpm/yarn)

Install and run locally
```bash
git clone https://github.com/Smartnaka/ragespark.git
cd ragespark
npm install
npm run dev
```

Open the app in your browser — Vite defaults to http://localhost:5173

Project structure (key files)
-----------------------------
- App.tsx — Main SPA, contains the Generator and Academy UI and form state.
- index.tsx / index.html — Vite entry and HTML wrapper.
- types.ts — Shared type definitions (GeneratorInput, GeneratedContent, HeatLevel, Tutorial).
- constants.tsx — Built-in tutorials and examples used by the Academy.
- services/
  - geminiService.ts — Gemini (@google/genai) integration (recommended approach when using server-side keys).
  - openaiService.ts — OpenAI example integration (currently includes a hardcoded key — see Security & ethics).
- metadata.json — App metadata and short description.
- package.json — Scripts and dependencies (React, Vite, @google/genai).

How the generator works
-----------------------
- The UI collects a GeneratorInput:
  - topic: string
  - heat: one of HeatLevel (MILD, SPICY, RAGE, NUCLEAR)
  - platform: 'X/Twitter' | 'TikTok' | 'Reddit' | 'YouTube'
- It calls generateRagebait(...) from services/geminiService.ts (default).
- The AI is prompted to return a JSON object with:
  - hook: the short post text/headline
  - strategy: the engagement technique used
  - psychology: why that technique triggers engagement

Switching AI providers
----------------------
By default App.tsx imports generateRagebait from services/geminiService.ts. To swap providers:

- Geminis (recommended): keep using services/geminiService.ts and provide the API key securely on the server or in a server-side function. geminiService constructs a GoogleGenAI client and requests a typed JSON response.
- OpenAI (example): services/openaiService.ts shows how to call the OpenAI chat completions endpoint and parse JSON. Note: This example currently contains a plaintext API key in the repository — do not run with that key; instead, refactor to use environment variables on a server.

Development
-----------
Useful npm scripts (package.json)
- npm run dev — run Vite dev server
- npm run build — build production bundle
- npm run preview — preview built output

Notes
- This is a TypeScript React app (tsconfig.json included).
- Dev dependencies include @vitejs/plugin-react and TypeScript.

Security & ethics (read before running or deploying)
---------------------------------------------------
The project intentionally generates provocative content. That raises important ethical, legal and platform policy questions.

Safety guidance in the code
- The service prompts include a "SAFETY RULE: Do not generate hate speech, harassment, or illegal content. Keep it to 'safe' controversies (food, tech, lifestyle, opinions)."

Critical security issues discovered in the repository
- services/openaiService.ts currently includes a plaintext OpenAI API key. This is a serious security issue — anyone with access to the repository can use/burn the key and it may lead to unexpected charges or abuse.

Immediate recommended actions (please do these now)
1. Remove the embedded key from services/openaiService.ts.
2. Rotate/revoke the exposed OpenAI API key immediately from your provider dashboard.
3. Move all API keys to secure server-side storage (environment variables, secret manager) and never expose them in client-side code or checked-in files.
4. Use a server-side proxy or serverless function to perform AI calls; the front-end should never call third-party AI APIs directly with a secret key.
5. Add a pre-commit or CI check to prevent secrets from being committed (e.g., git-secrets, detect-secrets).

How to store keys safely
- Use environment variables on the server or a serverless backend that the front-end calls.
- Example (server): set API_KEY in your server environment and have a /api/generate endpoint that calls the AI provider and returns the JSON output.
- If you must store build-time keys, do so as build secrets in your CI provider and avoid exposing them to client bundles.

Ethics and policy
- Do not use the app to generate or amplify content that targets protected groups, advocates harm, or violates platform rules.
- Prefer "low‑stakes" controversies (taste, preferences, mild gatekeeping), and always include manual human review before posting.
- Keep an audit log and human moderation step if deploying for multiple users.

Recommended fixes (code-level)
------------------------------
- Replace the inline key in services/openaiService.ts with a call that reads from process.env or a server-side secret and ensure the file is never served to the client with secrets.
- Implement a server-side /api/generate endpoint. Example flow:
  - Frontend -> POST /api/generate { topic, heat, platform }
  - Server -> calls GoogleGenAI or OpenAI using server-side secret -> returns JSON to frontend
- Add a .env.example file (without real keys) and update docs to show how to run locally with safe patterns.
- Add a CONTRIBUTING.md and SECURITY.md that instructs contributors about secrets and responsible disclosure.

Example .env.example (do NOT commit real keys)
```
# Example server env (do not commit real keys)
API_KEY=your_server_side_ai_key_here
```

Contributing & license
----------------------
- This project currently has no license file. Add a LICENSE (MIT, Apache‑2.0, etc.) if you want to allow reuse.
- Suggested contributor workflow:
  1. Open an issue describing the change.
  2. Fork the repo and create a feature branch.
  3. Submit a PR.

Contact
-------
Maintainer: Smartnaka  
GitHub: https://github.com/Smartnaka

Appendix — Useful code pointers
- App UI and tabs: App.tsx
- Built-in tutorials: constants.tsx
- Types and enums: types.ts
- Gemini integration: services/geminiService.ts
- OpenAI integration (example/unsafe until keys removed): services/openaiService.ts
- Metadata: metadata.json

If you'd like, I can:
- Update services/openaiService.ts to read its key from an environment variable and add a server-side example endpoint (Express or serverless) that proxies requests securely.
- Create a SECURITY.md and .env.example and add a short CONTRIBUTING.md.
- Add a license file of your choice.

Important: I fetched repository files to create this README. The search results may be incomplete; view the project in GitHub to see all files: https://github.com/Smartnaka/ragespark