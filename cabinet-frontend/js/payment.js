import { CONFIG } from "./config.js";
import { api } from "./api.js";
import { flash, setLoading } from "./ui.js";

const form = document.querySelector("[data-payment-form]");
const documentId = new URLSearchParams(location.search).get("document");
if (form && documentId) form.elements.document_id.value = documentId;

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button[type=submit]");
  const values = Object.fromEntries(new FormData(form));
  if (!/^\+?[0-9 ]{8,15}$/.test(values.phone)) return flash("Saisissez un numéro de téléphone valide.", "error");
  setLoading(button, true, "Initialisation…");
  try {
    const result = await api(CONFIG.endpoints.createPayment, { method: "POST", body: JSON.stringify(values) });
    const transactionId = result.transaction_id ?? result.id;
    if (result.payment_url) return location.assign(result.payment_url);
    if (!transactionId) throw new Error("L'API n'a retourné aucun identifiant de transaction.");
    sessionStorage.setItem("transaction_id", transactionId);
    location.assign(`paiement-statut.html?id=${encodeURIComponent(transactionId)}`);
  } catch (error) {
    flash(error.message, "error");
    setLoading(button, false);
  }
});

