import { STATE_IDS } from "../consts/states";
import type { AppState } from "../types/stateType";

// ── State visibility management ────────────────────────────────────────────────
export function showState(state: AppState) {
  Object.entries(STATE_IDS).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (key === state) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
}

// ── Busy state with countdown ──────────────────────────────────────────────────
let countdownInterval: ReturnType<typeof setInterval> | null = null;

export function showBusy(seconds: number, excuse: string) {
  showState("busy");

  const excuseEl = document.getElementById("busy-excuse-text");
  if (excuseEl) excuseEl.textContent = excuse;

  // Countdown
  const countdownEl = document.getElementById("busy-countdown");
  if (!countdownEl) return;

  let remaining = seconds;
  countdownEl.textContent = String(remaining);

  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    remaining--;
    countdownEl.textContent = String(remaining);
    if (remaining <= 0) {
      clearInterval(countdownInterval!);
      countdownInterval = null;
      showState("initial");
    }
  }, 1000);
}
