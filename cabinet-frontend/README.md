# Frontend du cabinet juridique

Frontend HTML/CSS/JavaScript conçu pour un backend FastAPI organisé autour de
`documents`, `payments`, `webhooks` et `admin`.

## Démarrage

1. Démarrer FastAPI sur `http://127.0.0.1:8000`.
2. Vérifier les routes dans `http://127.0.0.1:8000/docs`.
3. Adapter uniquement `js/config.js` si les chemins diffèrent.
4. Servir le frontend : `python -m http.server 5500` depuis ce dossier.
5. Ouvrir `http://127.0.0.1:5500`.

## Contrat API supposé

- `GET /documents` : liste des documents.
- `GET /documents/{id}` : détail d'un document.
- `POST /payments` : création d'une transaction.
- `GET /payments/{id}/status` : statut d'une transaction.
- `POST /admin/login` : connexion administrateur.
- `GET /admin/dashboard` : statistiques.
- `GET /admin/transactions` : transactions.

Le client accepte les listes JSON directes ou enveloppées dans `items`,
`documents`, `results` ou `data`. Les erreurs FastAPI présentes dans `detail`
sont affichées clairement.

## Sécurité

Le token administrateur est stocké dans `sessionStorage`, puis envoyé avec
`Authorization: Bearer <token>`. Ne placez aucun secret dans le frontend.

