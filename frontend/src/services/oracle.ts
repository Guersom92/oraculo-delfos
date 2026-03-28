import { showState, showBusy } from "../utils/stateManager";
import { typewriterStream, streamText } from "../utils/effects";
import { EXCUSES } from "../consts/excuses";

// ── API call to oracle endpoint ────────────────────────────────────────────────
export async function consultOracle(question: string) {
  showState("trance");

  try {
    const response = await fetch("http://localhost:3000/api/oracle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (response.status === 429) {
      // Rate limited
      const retryAfter = parseInt(
        response.headers.get("Retry-After") || "60",
        10,
      );
      let data: { retryAfter?: number } = {};
      try {
        data = await response.json();
      } catch {}
      
      const excuse = EXCUSES[Math.floor(Math.random() * EXCUSES.length)];
      showBusy(data.retryAfter ?? retryAfter, excuse);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // ── Streaming response ────────────────────────────────────────────────
    showState("prophecy");
    const prophecyEl = document.getElementById(
      "prophecy-text",
    ) as HTMLElement;
    const cursorEl = document.getElementById(
      "prophecy-cursor",
    ) as HTMLElement;
    prophecyEl.textContent = "";
    cursorEl.classList.remove("hidden");

    const contentType = response.headers.get("Content-Type") || "";

    if (
      contentType.includes("text/event-stream") ||
      contentType.includes("text/plain")
    ) {
      // SSE / streaming text
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") continue;
            try {
              const parsed = JSON.parse(raw);
              const chunk: string =
                parsed.delta ?? parsed.text ?? parsed.answer ?? raw;
              await streamText(chunk, prophecyEl, 25, 20);
            } catch {
              // plain text chunk
              await streamText(raw, prophecyEl, 25, 20);
            }
          }
        }
      }
      cursorEl.classList.add("hidden");
    } else {
      // JSON response with full answer
      const data: { answer: string } = await response.json();
      await typewriterStream(data.answer, prophecyEl, cursorEl);
    }
  } catch (err) {
    console.error("Oracle error:", err);
    showState("initial");
    const errorEl = document.getElementById("form-error");
    if (errorEl) {
      errorEl.textContent = "Los dioses no responden. Intenta de nuevo.";
      errorEl.classList.remove("hidden");
      setTimeout(() => errorEl.classList.add("hidden"), 4000);
    }
  }
}
