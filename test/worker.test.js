import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.js";

const baseUrl = "https://promptcraft.test";
const headers = { "content-type": "application/json" };

function makeRequest(method, path, body, raw = false) {
  return new Request(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : raw ? body : JSON.stringify(body)
  });
}

function mockEnv(run = async () => ({ response: "Reusable prompt" })) {
  return { AI: { run } };
}

test("GET / serves the app", async () => {
  const response = await worker.fetch(makeRequest("GET", "/"), mockEnv());
  assert.equal(response.status, 200);
  assert.match(await response.text(), /PromptCraft/);
});

test("unknown routes return 404", async () => {
  const response = await worker.fetch(makeRequest("GET", "/missing"), mockEnv());
  assert.equal(response.status, 404);
});

test("generation endpoint rejects methods other than POST", async () => {
  const response = await worker.fetch(makeRequest("GET", "/generate-prompt"), mockEnv());
  assert.equal(response.status, 405);
});

test("generation endpoint rejects malformed JSON", async () => {
  const response = await worker.fetch(makeRequest("POST", "/generate-prompt", "{", true), mockEnv());
  assert.equal(response.status, 400);
});

test("generation endpoint rejects unsupported model values", async () => {
  const response = await worker.fetch(
    makeRequest("POST", "/generate-prompt", { model: "unknown", scenario: "Write a note" }),
    mockEnv()
  );
  assert.equal(response.status, 400);
});

test("generation endpoint rejects blank scenarios", async () => {
  const response = await worker.fetch(
    makeRequest("POST", "/generate-prompt", { model: "llama-3.2-1b", scenario: "  " }),
    mockEnv()
  );
  assert.equal(response.status, 400);
});

test("generation endpoint rejects scenarios over 2,000 characters", async () => {
  const response = await worker.fetch(
    makeRequest("POST", "/generate-prompt", {
      model: "llama-3.2-1b",
      scenario: "x".repeat(2001)
    }),
    mockEnv()
  );
  assert.equal(response.status, 400);
});

test("valid requests call the selected 8B model and return its prompt", async () => {
  let calledModel;
  const response = await worker.fetch(
    makeRequest("POST", "/generate-prompt", {
      model: "llama-3.1-8b",
      scenario: "Write a polite note"
    }),
    mockEnv(async (model) => {
      calledModel = model;
      return { response: "Role: Writer" };
    })
  );

  assert.equal(response.status, 200);
  assert.equal(calledModel, "@cf/meta/llama-3.1-8b-instruct-fast");
  assert.deepEqual(await response.json(), {
    prompt: "Role: Writer",
    model: "@cf/meta/llama-3.1-8b-instruct-fast"
  });
});

test("daily Workers AI exhaustion returns a friendly 429", async () => {
  const response = await worker.fetch(
    makeRequest("POST", "/generate-prompt", {
      model: "llama-3.2-1b",
      scenario: "Write a polite note"
    }),
    mockEnv(async () => {
      throw new Error("3036: daily neuron limit reached");
    })
  );

  assert.equal(response.status, 429);
  assert.match((await response.json()).error, /allowance has been used/);
});

test("other Workers AI errors return a friendly 502", async () => {
  const response = await worker.fetch(
    makeRequest("POST", "/generate-prompt", {
      model: "llama-3.2-1b",
      scenario: "Write a polite note"
    }),
    mockEnv(async () => {
      throw new Error("temporary model failure");
    })
  );

  assert.equal(response.status, 502);
  assert.match((await response.json()).error, /temporarily unavailable/);
});

test("an empty model response returns a friendly 502", async () => {
  const response = await worker.fetch(
    makeRequest("POST", "/generate-prompt", {
      model: "llama-3.2-1b",
      scenario: "Write a polite note"
    }),
    mockEnv(async () => ({ response: "  " }))
  );

  assert.equal(response.status, 502);
  assert.match((await response.json()).error, /empty result/);
});
