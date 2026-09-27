import { CONFIG } from "./config.js";
import { api } from "./api.js";
import { escapeHtml, flash, money } from "./ui.js";

const root = document.querySelector("[data-document]");
const id = new URLSearchParams(location.search).get("id");

async function load() {
  if (!id) return flash("Identifiant du document absent.", "error");
  try {
    const doc = await api(CONFIG.endpoints.document(id));
    const title = escapeHtml(doc.title ?? doc.titre ?? "Document juridique");
    root.innerHTML = `<div class="detail__content">
      <span class="eyebrow">${escapeHtml(doc.category ?? doc.categorie ?? "Publication")}</span>
      <h1>${title}</h1><p class="lead">${escapeHtml(doc.description ?? "Document professionnel disponible après validation du paiement.")}</p>
      <ul class="check-list"><li>Format PDF sécurisé</li><li>Téléchargement après paiement</li><li>Reçu de transaction</li></ul>
    </div><aside class="purchase-card"><span>Prix</span><strong>${money(doc.price ?? doc.prix)}</strong>
      <a class="button button--gold" href="paiement.html?document=${encodeURIComponent(id)}">Acheter ce document</a>
      <small>Vous serez redirigé vers le paiement sécurisé.</small></aside>`;
    document.title = `${title} — Cabinet NIC`;
  } catch (error) { flash(error.message, "error"); }
}
if (root) load();

