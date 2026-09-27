import { CONFIG } from "./config.js";
import { api, normalizeList } from "./api.js";
import { escapeHtml, flash, money, setLoading } from "./ui.js";

const login = document.querySelector("[data-login-form]");
login?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = login.querySelector("button");
  setLoading(button, true, "Connexion…");
  try {
    const credentials = Object.fromEntries(new FormData(login));
    const result = await api(CONFIG.endpoints.adminLogin, { method: "POST", body: JSON.stringify(credentials) });
    const token = result.access_token || result.token;
    if (!token) throw new Error("Token absent de la réponse API.");
    sessionStorage.setItem("admin_token", token);
    location.assign("dashboard.html");
  } catch (error) { flash(error.message, "error"); setLoading(button, false); }
});

async function loadDashboard() {
  if (!sessionStorage.getItem("admin_token")) return location.replace("login.html");
  try {
    const [stats, transactions] = await Promise.all([
      api(CONFIG.endpoints.adminDashboard), api(CONFIG.endpoints.adminTransactions),
    ]);
    const values = {
      documents: stats.documents_count ?? stats.total_documents ?? 0,
      transactions: stats.transactions_count ?? stats.total_transactions ?? 0,
      clients: stats.clients_count ?? stats.total_clients ?? 0,
      revenue: money(stats.revenue ?? stats.chiffre_affaires ?? 0),
    };
    document.querySelectorAll("[data-stat]").forEach((node) => { node.textContent = values[node.dataset.stat]; });
    const rows = normalizeList(transactions).slice(0, 8).map((tx) => `<tr><td>#${escapeHtml(tx.id)}</td><td>${escapeHtml(tx.client_email || tx.email || "—")}</td><td>${money(tx.amount || tx.montant)}</td><td><span class="badge">${escapeHtml(tx.status || tx.statut || "—")}</span></td></tr>`).join("");
    document.querySelector("[data-transactions]").innerHTML = rows || `<tr><td colspan="4">Aucune transaction.</td></tr>`;
  } catch (error) {
    if (error.status === 401) { sessionStorage.clear(); return location.replace("login.html"); }
    flash(error.message, "error");
  }
}

document.querySelector("[data-logout]")?.addEventListener("click", () => { sessionStorage.clear(); location.replace("login.html"); });
if (document.querySelector("[data-dashboard]")) loadDashboard();

