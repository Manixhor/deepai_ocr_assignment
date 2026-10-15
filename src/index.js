const MODELS = {
  "llama-3.2-1b": {
    id: "@cf/meta/llama-3.2-1b-instruct",
    label: "Llama 3.2 1B (faster)",
    promptGuidance: "Because this is the smaller, faster model, keep each section especially brief and use simple, direct wording."
  },
  "llama-3.1-8b": {
    id: "@cf/meta/llama-3.1-8b-instruct-fast",
    label: "Llama 3.1 8B Fast (more capable)",
    promptGuidance: "Use the extra capacity to make the prompt more thoughtful and specific: clarify the role, context, task, constraints, and output format where the scenario supports it. Keep all details grounded in what the user said, and use placeholders for missing facts."
  }
};

const SYSTEM_PROMPT = `You are a thoughtful, experienced prompt writer. Turn the user's request into clear instructions they can give to another AI. Do not do the requested task yourself: do not write the email, answer, plan, code, or other final deliverable. Return only the reusable prompt, with no introduction or explanation.

Use these headings in this order: Role, Context, Task, Constraints, Output Format. Make the Role fit the task. In Context, include only details the user actually gave. In Task, tell the next AI what to create. In Constraints, include only preferences or limits the user mentioned. In Output Format, say what form the answer should take without writing the answer itself.

Never guess missing facts or add requirements the user did not ask for. Use a clear placeholder such as [Company name] when a detail is missing. Keep the result concise, natural, and easy to copy. Before responding, check that you wrote a prompt for another AI rather than completing the task.`;

const PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f5f7fb">
    <title>PromptCraft — Clear prompts, ready to use</title>
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
    <h1>Get a clearer prompt for your next task.</h1>
    <p class="intro">Tell us what you need help with. We’ll turn it into clear instructions you can copy into an AI tool. PromptCraft writes the prompt; it won’t complete the task for you.</p>
    <form class="card" id="form">
      <div class="field">
        <label for="model">Pick the style that suits you</label>
        <select id="model" name="model">
          <option value="llama-3.2-1b">Llama 3.2 1B — Quick response</option>
          <option value="llama-3.1-8b">Llama 3.1 8B Fast — More detailed response</option>
        </select>
        <p class="hint">For a more detailed response, choose Llama 3.1 8B Fast.</p>
      </div>
      <div class="field">
        <label for="scenario">What would you like the AI to help you with?</label>
        <textarea id="scenario" name="scenario" maxlength="2000" required placeholder="For example: Help me write a friendly email to a hiring manager about a software engineering role."></textarea>
        <p class="hint">Add any helpful details, like who it’s for or the tone you want. Up to 2,000 characters.</p>
      </div>
      <button id="submit" type="submit">Create my prompt</button>
      <p class="message" id="message" role="status" aria-live="polite"></p>
      <section class="result" id="result" aria-label="Generated prompt">
        <div class="result-head"><label for="output">Your prompt is ready to use</label><button class="copy" id="copy" type="button">Copy prompt</button></div>
        <textarea id="output" readonly></textarea>
      </section>
    </form>
    <footer>Made with Cloudflare Workers AI · Daily usage limits apply</footer>
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
      message.textContent = 'Putting your prompt together…';
      submit.disabled = true;
      submit.textContent = 'Creating…';
      try {
        const response = await fetch('/generate-prompt', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ model: document.querySelector('#model').value, scenario: document.querySelector('#scenario').value })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'We couldn’t create your prompt just now. Please try again.');
        output.value = data.prompt;
        result.classList.add('visible');
        message.textContent = 'All set — your prompt is ready to copy.';
      } catch (error) {
        message.className = 'message error';
        message.textContent = error.message;
      } finally {
        submit.disabled = false;
        submit.textContent = 'Create my prompt';
      }
    });
    document.querySelector('#copy').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(output.value);
        message.className = 'message';
        message.textContent = 'Copied. Your prompt is ready to paste.';
      } catch {
        output.select();
        message.textContent = 'Select the prompt above and copy it.';
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
      return json({ error: "That page isn’t here. Head back to PromptCraft and try again." }, 404);
    }

    if (request.method !== "POST") {
      return json({ error: "Please send your model and scenario as a POST request." }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "We couldn’t read that request. Please check the format and try again." }, 400);
    }

    const model = MODELS[body?.model];
    const scenario = typeof body?.scenario === "string" ? body.scenario.trim() : "";

    if (!model) {
      return json({ error: "Please choose one of the available models and try again." }, 400);
    }
    if (!scenario) {
      return json({ error: "Tell us what you’d like the AI to help with, then try again." }, 400);
    }
    if (scenario.length > 2000) {
      return json({ error: "That’s a little long. Please keep your description under 2,000 characters." }, 400);
    }

    try {
      const result = await env.AI.run(model.id, {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Create a reusable prompt for this scenario. Return only the prompt, using these headings in this order: Role, Context, Task, Constraints, Output Format. Make the role fit the task. Keep context to facts in the scenario. Tell the next AI what to create, and describe the expected format without writing the answer. Include only constraints the user mentioned. If something important is missing, use a clear placeholder such as [Company name] instead of guessing. Keep the wording natural and concise.\n\nGuidance for the selected model: ${model.promptGuidance}\n\nScenario:\n${scenario}`
          }
        ],
        max_tokens: 400,
        temperature: 0.2
      });
      const prompt = typeof result?.response === "string" ? result.response.trim() : "";
      if (!prompt) {
        return json({ error: "We didn’t get a prompt back this time. Please try again." }, 502);
      }
      return json({ prompt, model: model.id });
    } catch (error) {
      if (isDailyLimitError(error)) {
        return json({ error: "You’ve reached today’s AI usage limit. Please try again tomorrow." }, 429);
      }
      return json({ error: "The AI service is taking a short break. Please try again in a moment." }, 502);
    }
  }
};
