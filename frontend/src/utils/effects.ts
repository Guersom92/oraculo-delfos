// ── Typewriter effect ─────────────────────────────────────────────────────────
export async function typewriterStream(
  text: string,
  targetEl: HTMLElement,
  cursorEl: HTMLElement,
) {
  targetEl.textContent = "";
  cursorEl.classList.remove("hidden");

  const words = text.split("");
  for (const char of words) {
    targetEl.textContent += char;
    await new Promise((r) => setTimeout(r, 28 + Math.random() * 22));
  }

  // Blink cursor briefly then hide
  setTimeout(() => {
    cursorEl.classList.add("hidden");
  }, 2500);
}

// ── Streaming text effect ──────────────────────────────────────────────────────
export async function streamText(
  chunk: string,
  targetEl: HTMLElement,
  delay: number = 25,
  randomness: number = 20,
) {
  for (const char of chunk) {
    targetEl.textContent += char;
    await new Promise((r) =>
      setTimeout(r, delay + Math.random() * randomness),
    );
  }
}
