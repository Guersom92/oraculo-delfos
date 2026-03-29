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

      const excuse = EXCUSES[Math.floor(Math.random() * EXCUSES.length)];
      showBusy(retryAfter, excuse);
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


    // streaming text
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      prophecyEl.textContent += buffer;
      
    }
    cursorEl.classList.add("hidden");

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
