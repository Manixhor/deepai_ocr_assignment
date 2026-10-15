# PromptCraft

PromptCraft is a small Cloudflare Worker app that turns a scenario into a copy-ready prompt. It uses Cloudflare Workers AI and offers two text models: Llama 3.2 1B for faster generation and Llama 3.1 8B FP8 for a more capable option.

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

## API

The app provides a page at `/` and a JSON endpoint at `POST /generate-prompt`.

Example request:

```json
{
  "model": "llama-3.2-1b",
  "scenario": "I need an email to apologize for a delayed product shipment."
}
```

Supported model values are `llama-3.2-1b` and `llama-3.1-8b`.

## System prompt

The system prompt assigns the model the role of an expert prompt engineer and clearly says to create a prompt rather than complete the user's scenario. It asks for role, context, task, constraints, and output format, while telling the model not to invent missing facts and to use placeholders instead. It also keeps instructions compact for the smaller model and allows richer structure for the larger one. This gives users a prompt they can reuse with another AI tool.

## Usage limits and errors

Cloudflare currently provides 10,000 free Workers AI Neurons per day. If the account reaches that allowance, the API returns HTTP 429 with a friendly message. Invalid input and other temporary AI failures also return readable JSON errors.

## Deploy

After signing in to Wrangler, run:

```sh
npm run deploy
```

Wrangler will print the deployed `workers.dev` URL.
# deepai_ocr_assignment
