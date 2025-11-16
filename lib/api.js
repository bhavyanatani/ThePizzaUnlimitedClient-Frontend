const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const buildHeaders = (token, customHeaders = {}, hasBody = false) => {
  const headers = { ...customHeaders };
  if (hasBody && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  if (token && !headers["Authorization"]) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const apiFetch = async (path, { method = "GET", token, headers = {}, body, cache = "no-store", credentials = "include" } = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token, headers, !!body),
    body: body ? JSON.stringify(body) : undefined,
    cache,
    credentials,
  });
  return res;
};

export const menuApi = {
  getCategories: async () => {
    const res = await apiFetch("/api/menu/categories");
    return res.json();
  },

  getItemsByCategory: async (categoryId, limit = 100) => {
    const res = await apiFetch(`/api/menu/category/${categoryId}?limit=${limit}`);
    return res.json();
  },

  getItemById: async (itemId) => {
    const res = await apiFetch(`/api/menu/item/${itemId}`);
    return res.json();
  },
};

export const cartApi = {
  getMy: async (token) => {
    const res = await apiFetch("/api/cart/my", { token });
    return res.json();
  },
  addItem: async (itemId, quantity = 1, token) => {
    const res = await apiFetch("/api/cart/add", {
      method: "POST",
      token,
      body: { itemId, quantity },
    });
    return res.json();
  },
  updateItem: async (itemId, quantity, token) => {
    const res = await apiFetch(`/api/cart/${itemId}`, {
      method: "PUT",
      token,
      body: { quantity },
    });
    return res.json();
  },
  removeItem: async (itemId, token) => {
    const res = await apiFetch(`/api/cart/${itemId}`, { method: "DELETE", token });
    return res.json();
  },
  getCount: async (token) => {
    const res = await apiFetch("/api/cart/count", { token });
    return res.json();
  },
};

export const ordersApi = {
  create: async (orderData, token) => {
    const res = await apiFetch("/api/orders", { method: "POST", token, body: orderData });
    return res.json();
  },
  getMy: async (token) => {
    const res = await apiFetch("/api/orders/my", { token });
    return res.json();
  },
  getById: async (orderId, token) => {
    const res = await apiFetch(`/api/orders/${orderId}`, { token });
    return res.json();
  },
  cancel: async (orderId, token) => {
    const res = await apiFetch(`/api/orders/${orderId}`, { method: "PUT", token });
    return res.json();
  },
  invoiceUrl: (orderId) => `${API_BASE_URL}/api/orders/${orderId}/invoice`,
};

export const reservationsApi = {
  create: async (data, token) => {
    const res = await apiFetch("/api/reservations", { method: "POST", token, body: data });
    return res.json();
  },
  getMy: async (token) => {
    console.log("API_BASE_URL", API_BASE_URL);
    const res = await apiFetch("/api/reservations/my", { token });
    return res.json();
  },
  cancel: async (reservationId, token) => {
    const res = await apiFetch(`/api/reservations/${reservationId}`, { method: "PUT", token });
    return res.json();
  },
};

export const reviewsApi = {
  list: async () => {
    const res = await apiFetch("/api/reviews", { credentials: "include" });
    return res.json();
  },
  create: async (data, token) => {
    const res = await apiFetch("/api/reviews", { method: "POST", token, body: data });
    return res.json();
  },
};

export const apiBaseUrl = API_BASE_URL;
  