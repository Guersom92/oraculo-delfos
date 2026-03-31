import { STATE_IDS } from "../consts/states";
import type { AppState } from "../types/stateType";
import { EXCUSES } from "../consts/excuses";

// ── LocalStorage keys ──────────────────────────────────────────────────────────
const STORAGE_RETRY_UNTIL = "oracle_retry_until";
const STORAGE_RETRY_EXCUSE = "oracle_retry_excuse";

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

  // Save retry info to localStorage
  const retryUntil = Date.now() + seconds * 1000;
  localStorage.setItem(STORAGE_RETRY_UNTIL, String(retryUntil));
  localStorage.setItem(STORAGE_RETRY_EXCUSE, excuse);

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
      localStorage.removeItem(STORAGE_RETRY_UNTIL);
      localStorage.removeItem(STORAGE_RETRY_EXCUSE);
      showState("initial");
    }
  }, 1000);
}

// ── Check and restore countdown from localStorage ──────────────────────────────
export function checkAndRestoreCountdown() {
  const retryUntil = localStorage.getItem(STORAGE_RETRY_UNTIL);
  const excuse = localStorage.getItem(STORAGE_RETRY_EXCUSE);

  if (!retryUntil || !excuse) return;

  const now = Date.now();
  const remaining = Math.ceil((parseInt(retryUntil, 10) - now) / 1000);

  // If the countdown has expired, clean up and return
  if (remaining <= 0) {
    localStorage.removeItem(STORAGE_RETRY_UNTIL);
    localStorage.removeItem(STORAGE_RETRY_EXCUSE);
    return;
  }

  // Restore the busy state with countdown
  showBusy(remaining, excuse);
}
