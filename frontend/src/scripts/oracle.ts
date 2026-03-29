import { consultOracle } from "../services/oracle";
import { showState } from "../utils/stateManager";

// ── Event listeners and initialization ─────────────────────────────────────────
export function initOracleScript() {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("oracle-form") as HTMLFormElement;
    const textarea = document.getElementById(
      "oracle-question",
    ) as HTMLTextAreaElement;
    const btnAgain = document.getElementById("btn-again") as HTMLButtonElement;
    const errorEl = document.getElementById("form-error") as HTMLElement;
    console.log("is :",form)

    // Submit form
    form?.addEventListener("submit", async (e) => {
      console.log("Form submitted")
      e.preventDefault();
      const question = textarea.value.trim();

      if (!question) {
        errorEl.textContent =
          "El Oráculo no responde al silencio. Formula tu pregunta.";
        errorEl.classList.remove("hidden");
        textarea.focus();
        return;
      }

      errorEl.classList.add("hidden");
      await consultOracle(question);
    });

    // "Consult again" resets to initial
    btnAgain?.addEventListener("click", () => {
      showState("initial");
      textarea.value = "";
      const prophecyEl = document.getElementById("prophecy-text");
      if (prophecyEl) prophecyEl.textContent = "";
      textarea.focus();
    });

    // Initial state
    showState("initial");
  });
}
