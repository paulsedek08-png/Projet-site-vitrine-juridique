import { CONFIG } from "./config.js";
import { api } from "./api.js";
import { escapeHtml } from "./ui.js";

const root = document.querySelector("[data-payment-status]");
const id = new URLSearchParams(location.search).get("id") || sessionStorage.getItem("transaction_id");
let attempts = 0;

async function check() {
  attempts += 1;
  try {
    const data = await api(CONFIG.endpoints.paymentStatus(id));
    const status = String(data.status || data.statut || "pending").toLowerCase();
    if (["success", "successful", "paid", "completed", "valide"].includes(status)) {
      const token = data.download_token || data.token;
      root.innerHTML = `<div class="status-icon status-icon--ok">✓</div><h1>Paiement confirmé</h1><p>Votre document est prêt.</p>${token ? `<a class="button button--gold" href="${CONFIG.API_URL}${CONFIG.endpoints.download(token)}">Télécharger le PDF</a>` : ""}`;
      return;
    }
    if (["failed", "cancelled", "rejected", "echec"].includes(status)) {
      root.innerHTML = `<div class="status-icon status-icon--error">×</div><h1>Paiement non validé</h1><p>${escapeHtml(data.message || "La transaction a échoué ou a été annulée.")}</p><a class="button button--outline" href="catalogue.html">Retour au catalogue</a>`;
      return;
    }
    root.querySelector("p").textContent = `Vérification de la transaction… (${attempts})`;
    if (attempts < 24) setTimeout(check, 5000);
  } catch (error) {
    root.querySelector("p").textContent = error.message;
  }
}
if (root && id) check();

