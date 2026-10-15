# PromptCraft

PromptCraft helps turn a short description of a task into a clear prompt you can paste into another AI tool. It runs on Cloudflare Workers AI and offers two choices:

- **Quick response** uses Llama 3.2 1B.
- **More detailed response** uses Cloudflare’s fast Llama 3.1 8B model.

The Worker keeps generated prompts concise with a 400-token response limit. PromptCraft creates the prompt for your task; it doesn’t complete the task itself.

Live deployment: [promptcraft-worker.promptcraft-worker.workers.dev](https://promptcraft-worker.promptcraft-worker.workers.dev/)

## Run locally

To run PromptCraft on your computer, install Node.js and npm, then run these commands from the project folder:

```sh
npm install
npm run dev
```

Open the local address Wrangler prints. AI generation uses your Cloudflare account, so sign in first if Wrangler asks:

```sh
npx wrangler login
```

The `AI` binding in `wrangler.jsonc` connects the Worker to Cloudflare Workers AI.

To run the project’s checks:

```sh
npm test
```

## API

The web page is served at `/`. If you’re calling the API directly, send a `POST` request to `/generate-prompt` with a model and scenario:

Example request:

```json
{
  "model": "llama-3.2-1b",
  "scenario": "I need an email to apologize for a delayed product shipment."
}
```

Use `llama-3.2-1b` for a quick response or `llama-3.1-8b` for a more detailed response. The scenario must contain text and can be up to 2,000 characters.

## System prompt

PromptCraft asks the model to write instructions for another AI, not to do the task itself. The result uses five sections—Role, Context, Task, Constraints, and Output Format—so the next AI gets the key details in a useful order. It also tells the model to stick to what the user shared and use clear placeholders for missing details. The 1B model gets guidance to keep the result brief and direct; the 8B model is asked to add useful structure and detail when the scenario supports it.

## Usage limits and errors

The assignment describes a free allowance of 10,000 Workers AI Neurons per day. If the daily allowance runs out, PromptCraft explains that and asks you to try again tomorrow. It also returns a helpful message if the request is incomplete or the AI service is temporarily unavailable.

## Deploy

When you’re ready to publish your latest local changes, sign in to Wrangler and run:

```sh
npm run deploy
```

This updates the existing Worker, so the address stays the same. The live app is at [promptcraft-worker.promptcraft-worker.workers.dev](https://promptcraft-worker.promptcraft-worker.workers.dev/).
# deepai_ocr_assignment
