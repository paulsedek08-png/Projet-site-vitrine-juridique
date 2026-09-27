export const CONFIG = Object.freeze({
  API_URL: "http://127.0.0.1:8000",
  CURRENCY: "XAF",
  endpoints: {
    documents: "/documents",
    document: (id) => `/documents/${encodeURIComponent(id)}`,
    createPayment: "/payments",
    paymentStatus: (id) => `/payments/${encodeURIComponent(id)}/status`,
    download: (token) => `/documents/download/${encodeURIComponent(token)}`,
    adminLogin: "/admin/login",
    adminDashboard: "/admin/dashboard",
    adminDocuments: "/admin/documents",
    adminTransactions: "/admin/transactions",
    adminClients: "/admin/clients",
  },
});

