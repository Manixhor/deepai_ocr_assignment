# PromptCraft

PromptCraft turns a scenario into a copy-ready prompt using Cloudflare Workers AI. It offers two model choices:

- **Llama 3.2 1B (faster)** for quick generation.
- **Llama 3.1 8B Fast (more capable)** for stronger prompt generation with Cloudflare's fast 8B model variant.

The Worker caps generated responses at 400 tokens to keep prompts concise and reduce generation time.

Live deployment: [promptcraft-worker.promptcraft-worker.workers.dev](https://promptcraft-worker.promptcraft-worker.workers.dev/)

## Run locally

You need Node.js and npm. From this project folder:

```sh
npm install
npm run dev
```

Open the local URL printed by Wrangler. Workers AI calls use your Cloudflare account, including during local development. Sign in when Wrangler prompts you:

```sh
npx wrangler login
```

The Worker is connected to Workers AI through the `AI` binding in `wrangler.jsonc`.

Run the automated checks with:

```sh
npm test
```

## API

The app provides a page at `/` and a JSON endpoint at `POST /generate-prompt`.

Example request:

```json
{
  "model": "llama-3.2-1b",
  "scenario": "I need an email to apologize for a delayed product shipment."
}
```

Supported model values are `llama-3.2-1b` and `llama-3.1-8b`. Each request must include a non-empty scenario of up to 2,000 characters.

## System prompt

The system prompt assigns the model the role of an expert prompt engineer and clearly says to create a prompt rather than complete the user's scenario. It asks for role, context, task, constraints, and output format, while telling the model not to invent missing facts and to use placeholders instead. It also keeps instructions compact for the smaller model and allows richer structure for the larger one. This gives users a prompt they can reuse with another AI tool.

## Usage limits and errors

Cloudflare currently provides 10,000 free Workers AI Neurons per day. If the account reaches that allowance, the API returns HTTP 429 with a friendly message. Invalid input and other temporary AI failures also return readable JSON errors.

## Deploy

After signing in to Wrangler, deploy the current local code with:

```sh
npm run deploy
```

This updates the existing Worker, so its URL stays the same unless you change the Worker name or domain configuration. The current live URL is [https://promptcraft-worker.promptcraft-worker.workers.dev/](https://promptcraft-worker.promptcraft-worker.workers.dev/).
# deepai_ocr_assignment
