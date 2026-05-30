import { NextResponse } from "next/server";

async function fetchHuggingFaceResponse(prompt: string) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not set");
  }

  const model = process.env.HUGGINGFACE_MODEL || "google/flan-t5-large";
  const baseUrls = [
    "https://api-inference.huggingface.co/models",
    "https://router.huggingface.co/hf-inference/models",
  ];

  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      for (const base of baseUrls) {
        const url = `${base}/${model}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: { max_new_tokens: 256, temperature: 0.4 },
              options: { wait_for_model: true },
            }),
            signal: controller.signal,
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(
              `Hugging Face request failed (${res.status}): ${errText.slice(0, 300)}`,
            );
          }

          const json = await res.json();
          let generated = "";
          if (Array.isArray(json) && json.length > 0) {
            generated = json[0].generated_text || json[0].generated_text || "";
          } else if (json && typeof json === "object") {
            generated = (json as any).generated_text || "";
          }

          if (!generated)
            throw new Error("Hugging Face returned an empty response");
          return String(generated).trim();
        } finally {
          clearTimeout(timeout);
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Hugging Face request failed");
}

function formatError(err: unknown) {
  if (err instanceof Error) {
    const cause = (err as any).cause;
    const causeInfo = cause
      ? `Cause: ${cause?.name || ""} ${cause?.code || ""} ${cause?.message || String(cause)}`.trim()
      : "";
    const stack = err.stack ? `\nStack:\n${err.stack}` : "";
    return [err.name, err.message, causeInfo, stack].filter(Boolean).join("\n");
  }
  return String(err);
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    let body: any = null;
    try {
      const trimmed = raw ? raw.trim() : "";
      if (!trimmed) body = {};
      else if (trimmed[0] === '"' || trimmed[0] === "'") {
        const unquoted = JSON.parse(trimmed);
        body = unquoted ? JSON.parse(unquoted) : {};
      } else {
        body = JSON.parse(trimmed);
      }
    } catch (parseErr) {
      return NextResponse.json(
        { success: false, message: String(parseErr) },
        { status: 400 },
      );
    }

    const exam = String(body?.exam || "").trim();
    const rankValue = String(body?.rank || "").trim();

    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam is required" },
        { status: 400 },
      );
    }

    const rank = rankValue ? Number(rankValue) : null;
    if (rankValue && (rank === null || Number.isNaN(rank) || rank <= 0)) {
      return NextResponse.json(
        { success: false, message: "Rank must be a positive number" },
        { status: 400 },
      );
    }

    const basePrompt =
      "you are given exam name and rank achived byme in that exam you just have give five most probable colleges i will get";
    const promptFull = `${basePrompt}\nExam: ${exam}\nRank: ${rank ?? "not provided"}`;

    try {
      const text = await fetchHuggingFaceResponse(promptFull);
      return new NextResponse(text, {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    } catch (hfError) {
      const message = formatError(hfError);
      return new NextResponse(message, {
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
  } catch (error) {
    const message = formatError(error);
    return new NextResponse(message, {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
