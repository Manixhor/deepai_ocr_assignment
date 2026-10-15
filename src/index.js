const MODELS = {
  "llama-3.2-1b": {
    id: "@cf/meta/llama-3.2-1b-instruct",
    label: "Llama 3.2 1B (faster)"
  },
  "llama-3.1-8b": {
    id: "@cf/meta/llama-3.1-8b-instruct-fast",
    label: "Llama 3.1 8B Fast (more capable)"
  }
};

const SYSTEM_PROMPT = `You are an expert prompt engineer. Your only job is to write instructions that a different AI assistant can follow to fulfill the user's scenario. You are not that assistant. Never write the scenario's final deliverable: do not draft the actual email, answer, plan, code, or other requested work. Return only a reusable prompt, not an introduction, explanation, example, or completed output. Use these exact headings: Role, Context, Task, Constraints, Output Format. Under Task, instruct the future AI to create the deliverable. Under Output Format, describe the form of the deliverable without writing its contents. Preserve facts from the scenario exactly. Never invent names, dates, products, order numbers, IDs, or other details; use bracketed placeholders such as [Order number] when information is missing. Do not add arbitrary word counts or requirements the user did not ask for. Keep the prompt direct and concise for the smaller model; use a little more structure for the larger model. If you start writing the final deliverable itself, stop and rewrite it as instructions for another AI.`;

const PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f5f7fb">
  <title>PromptCraft — Prompt Engineer</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #172033; background: #f5f7fb; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; background: radial-gradient(ellipse at 50% -15%, #e0eaff 0, transparent 55%), #f5f7fb; }
    main { width: min(760px, calc(100% - 32px)); margin: 0 auto; padding: 56px 0 48px; }
    .brand { display: flex; align-items: center; gap: 10px; color: #4b5bdc; font-size: 14px; font-weight: 750; letter-spacing: .02em; }
    .mark { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px; background: #4b5bdc; color: white; }
    h1 { margin: 28px 0 10px; font-size: clamp(32px, 7vw, 48px); line-height: 1.08; letter-spacing: -.045em; }
    .intro { max-width: 590px; margin: 0; color: #626d82; line-height: 1.65; }
    .card { margin-top: 30px; padding: 25px; border: 1px solid #e4e8f0; border-radius: 18px; background: rgba(255,255,255,.92); box-shadow: 0 12px 35px rgba(28, 43, 78, .06); }
    label { display: block; margin: 0 0 9px; font-size: 13px; font-weight: 700; }
    select, textarea { width: 100%; border: 1px solid #dbe1eb; border-radius: 10px; background: white; color: #172033; font: inherit; outline: none; }
    select { height: 46px; padding: 0 12px; }
    textarea { min-height: 142px; padding: 13px 14px; line-height: 1.55; resize: vertical; }
    select:focus, textarea:focus { border-color: #6875e5; box-shadow: 0 0 0 3px #6875e522; }
    .field + .field { margin-top: 21px; }
    .hint { margin: 8px 0 0; color: #7b8495; font-size: 12px; }
    button { width: 100%; height: 48px; margin-top: 22px; border: 0; border-radius: 10px; background: #4b5bdc; color: white; font: inherit; font-weight: 700; cursor: pointer; transition: background .15s, transform .15s; }
    button:hover { background: #3d4ac1; }
    button:active { transform: translateY(1px); }
    button:disabled { cursor: wait; opacity: .7; }
    .result { display: none; margin-top: 20px; }
    .result.visible { display: block; }
    .result-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 9px; }
    .result-head label { margin: 0; }
    .copy { width: auto; height: 34px; margin: 0; padding: 0 12px; background: #eef0ff; color: #414fc7; font-size: 12px; }
    .copy:hover { background: #e2e5ff; }
    #output { min-height: 180px; background: #fafbfe; white-space: pre-wrap; }
    .message { min-height: 20px; margin: 12px 0 0; color: #606c80; font-size: 13px; }
    .message.error { color: #b42318; }
    footer { margin-top: 20px; text-align: center; color: #8891a1; font-size: 12px; }
    @media (max-width: 520px) { main { padding-top: 34px; } .card { padding: 19px; } }
  </style>
</head>
<body>
  <main>
    <div class="brand"><span class="mark">✦</span> PROMPTCRAFT</div>
    <h1>Turn an idea into a better prompt.</h1>
    <p class="intro">Describe what you want an AI to help with. PromptCraft will shape your scenario into a clear, copy-ready prompt — it won’t do the task for you.</p>
    <form class="card" id="form">
      <div class="field">
        <label for="model">Choose a model</label>
        <select id="model" name="model">
          <option value="llama-3.2-1b">Llama 3.2 1B (faster)</option>
          <option value="llama-3.1-8b">Llama 3.1 8B Fast (more capable)</option>
        </select>
      </div>
      <div class="field">
        <label for="scenario">What do you need a prompt for?</label>
        <textarea id="scenario" name="scenario" maxlength="2000" required placeholder="Example: I need an email to apologize for a delayed product shipment."></textarea>
        <p class="hint">Share any useful context, audience, tone, or constraints. Up to 2,000 characters.</p>
      </div>
      <button id="submit" type="submit">Generate my prompt</button>
      <p class="message" id="message" role="status" aria-live="polite"></p>
      <section class="result" id="result" aria-label="Generated prompt">
        <div class="result-head"><label for="output">Your copy-ready prompt</label><button class="copy" id="copy" type="button">Copy prompt</button></div>
        <textarea id="output" readonly></textarea>
      </section>
    </form>
    <footer>Powered by Cloudflare Workers AI · Free daily usage is limited</footer>
  </main>
  <script>
    const form = document.querySelector('#form');
    const submit = document.querySelector('#submit');
    const message = document.querySelector('#message');
    const result = document.querySelector('#result');
    const output = document.querySelector('#output');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      result.classList.remove('visible');
      message.className = 'message';
      message.textContent = 'Creating your prompt…';
      submit.disabled = true;
      submit.textContent = 'Working…';
      try {
        const response = await fetch('/generate-prompt', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ model: document.querySelector('#model').value, scenario: document.querySelector('#scenario').value })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
        output.value = data.prompt;
        result.classList.add('visible');
        message.textContent = 'Your prompt is ready.';
      } catch (error) {
        message.className = 'message error';
        message.textContent = error.message;
      } finally {
        submit.disabled = false;
        submit.textContent = 'Generate my prompt';
      }
    });
    document.querySelector('#copy').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(output.value);
        message.className = 'message';
        message.textContent = 'Copied to clipboard.';
      } catch {
        output.select();
        message.textContent = 'Select and copy the prompt above.';
      }
    });
  </script>
</body>
</html>`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

function isDailyLimitError(error) {
  const message = String(error?.message ?? error).toLowerCase();
  return message.includes("3036") || message.includes("neuron") ||
    (message.includes("429") && (message.includes("limit") || message.includes("quota")));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(PAGE, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "x-content-type-options": "nosniff",
          "referrer-policy": "strict-origin-when-cross-origin"
        }
      });
    }

    if (url.pathname !== "/generate-prompt") {
      return json({ error: "Not found. Visit the home page to use PromptCraft." }, 404);
    }

    if (request.method !== "POST") {
      return json({ error: "Use POST with a JSON body containing model and scenario." }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Please send valid JSON with a model and scenario." }, 400);
    }

    const model = MODELS[body?.model];
    const scenario = typeof body?.scenario === "string" ? body.scenario.trim() : "";

    if (!model) {
      return json({ error: "Choose one of the supported models: llama-3.2-1b or llama-3.1-8b." }, 400);
    }
    if (!scenario) {
      return json({ error: "Please describe the scenario you want a prompt for." }, 400);
    }
    if (scenario.length > 2000) {
      return json({ error: "Please keep the scenario under 2,000 characters." }, 400);
    }

    try {
      const result = await env.AI.run(model.id, {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Selected model: ${model.label}\n\nCreate a reusable prompt for this scenario. Return only the prompt, with these five headings in this order: Role, Context, Task, Constraints, Output Format. Include every heading, even when its content is brief. Role names the role the future AI should take. Context contains only the scenario facts, with placeholders for missing details. Task tells the future AI to create the requested deliverable. Constraints gives only the tone and limits in the scenario. Output Format describes the form of the deliverable without drafting it. Never invent names, dates, products, numbers, or other facts. Put each missing detail in a labeled square-bracket placeholder; never use fake examples such as #12345. Do not add arbitrary word counts or requirements. Do not add an introduction, quotation marks, sample deliverable, or finished email.\n\nScenario:\n${scenario}`
          }
        ],
        max_tokens: 400,
        temperature: 0.2
      });
      const prompt = typeof result?.response === "string" ? result.response.trim() : "";
      if (!prompt) {
        return json({ error: "The model returned an empty result. Please try again." }, 502);
      }
      return json({ prompt, model: model.id });
    } catch (error) {
      if (isDailyLimitError(error)) {
        return json({ error: "Today's free Workers AI allowance has been used. Please try again after the daily reset." }, 429);
      }
      return json({ error: "Workers AI is temporarily unavailable. Please try again in a moment." }, 502);
    }
  }
};
