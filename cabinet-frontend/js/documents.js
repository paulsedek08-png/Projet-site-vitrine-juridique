import { CONFIG } from "./config.js";
import { api, normalizeList } from "./api.js";
import { escapeHtml, flash, money } from "./ui.js";

const grid = document.querySelector("[data-documents]");
const search = document.querySelector("[data-search]");
const category = document.querySelector("[data-category]");
let documents = [];

function card(doc) {
  const id = doc.id ?? doc.document_id;
  const title = escapeHtml(doc.title ?? doc.titre ?? "Document juridique");
  const description = escapeHtml(doc.description ?? "Consultez les informations détaillées de ce document.");
  const cat = escapeHtml(doc.category ?? doc.categorie ?? "Document");
  return `<article class="document-card">
    <div class="document-card__top"><span class="tag">${cat}</span><span class="price">${money(doc.price ?? doc.prix)}</span></div>
    <h3>${title}</h3><p>${description}</p>
    <a class="text-link" href="document.html?id=${encodeURIComponent(id)}">Voir le document <span>→</span></a>
  </article>`;
}

function render() {
  const query = search?.value.trim().toLowerCase() || "";
  const selected = category?.value || "";
  const filtered = documents.filter((doc) => {
    const text = `${doc.title || doc.titre || ""} ${doc.description || ""}`.toLowerCase();
    const cat = doc.category || doc.categorie || "Document";
    return text.includes(query) && (!selected || cat === selected);
  });
  grid.innerHTML = filtered.length ? filtered.map(card).join("") : `<div class="empty">Aucun document ne correspond à votre recherche.</div>`;
}

async function load() {
  try {
    documents = normalizeList(await api(CONFIG.endpoints.documents));
    const categories = [...new Set(documents.map((d) => d.category || d.categorie).filter(Boolean))];
    if (category) category.innerHTML += categories.map((c) => `<option>${escapeHtml(c)}</option>`).join("");
    render();
  } catch (error) {
    grid.innerHTML = `<div class="empty">Impossible de charger le catalogue.</div>`;
    flash(error.message, "error");
  }
}

search?.addEventListener("input", render);
category?.addEventListener("change", render);
if (grid) load();

