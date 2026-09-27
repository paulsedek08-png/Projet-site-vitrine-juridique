import { CONFIG } from "./config.js";

export const money = (value = 0) => new Intl.NumberFormat("fr-FR", {
  style: "currency", currency: CONFIG.CURRENCY, maximumFractionDigits: 0,
}).format(Number(value) || 0);

export const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[char]));

export function flash(message, type = "info") {
  const node = document.querySelector("[data-flash]");
  if (!node) return;
  node.textContent = message;
  node.className = `flash flash--${type}`;
  node.hidden = false;
}

export function setLoading(button, loading, label = "Traitement…") {
  if (!button) return;
  if (loading) {
    button.dataset.label = button.textContent;
    button.textContent = label;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.label || button.textContent;
    button.disabled = false;
  }
}

document.querySelector("[data-menu-button]")?.addEventListener("click", () => {
  document.querySelector("[data-nav]")?.classList.toggle("nav--open");
});

