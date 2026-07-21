const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ─── Core fetch wrapper ───────────────────────────────────

async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data.data;
}

// ─── Auth ─────────────────────────────────────────────────

export const auth = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  signin: (body) => request('/auth/signin', { method: 'POST', body: JSON.stringify(body) }),
};

// ─── Users ────────────────────────────────────────────────

export const users = {
  getAll: () => request('/users'),
  getById: (id) => request(`/users/${id}`),
  update: (id, body) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};

// ─── Clients ──────────────────────────────────────────────

export const clients = {
  getAll: () => request('/clients'),
  getById: (id) => request(`/clients/${id}`),
  create: (body) => request('/clients', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/clients/${id}`, { method: 'DELETE' }),
};

// ─── Stylists ─────────────────────────────────────────────

export const stylists = {
  getAll: () => request('/stylists'),
  getById: (id) => request(`/stylists/${id}`),
  create: (body) => request('/stylists', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/stylists/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/stylists/${id}`, { method: 'DELETE' }),
};

// ─── Services ─────────────────────────────────────────────

export const services = {
  getAll: (activeOnly = false) => request(`/services${activeOnly ? '?active=true' : ''}`),
  getById: (id) => request(`/services/${id}`),
  create: (body) => request('/services', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/services/${id}`, { method: 'DELETE' }),
};

// ─── Availability ─────────────────────────────────────────

export const availability = {
  getAll: (stylistId, availableOnly = false) => {
    const params = new URLSearchParams();
    if (stylistId) params.append('stylistId', stylistId);
    if (availableOnly) params.append('available', 'true');
    return request(`/availability?${params.toString()}`);
  },
  getById: (id) => request(`/availability/${id}`),
  create: (body) => request('/availability', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/availability/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/availability/${id}`, { method: 'DELETE' }),
};

// ─── Appointments ─────────────────────────────────────────

export const appointments = {
  getAll: () => request('/appointments'),
  getById: (id) => request(`/appointments/${id}`),
  create: (body) => request('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),
};

// ─── Appointment Services ─────────────────────────────────

export const appointmentServices = {
  getByAppointment: (appointmentId) => request(`/appointment-services?appointmentId=${appointmentId}`),
  add: (body) => request('/appointment-services', { method: 'POST', body: JSON.stringify(body) }),
  updatePrice: (body) => request('/appointment-services', { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (body) => request('/appointment-services', { method: 'DELETE', body: JSON.stringify(body) }),
};

// ─── Payments ─────────────────────────────────────────────

export const payments = {
  getAll: () => request('/payments'),
  getById: (id) => request(`/payments/${id}`),
  create: (body) => request('/payments', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/payments/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/payments/${id}`, { method: 'DELETE' }),
};

// ─── Products ─────────────────────────────────────────────

export const products = {
  getAll: (activeOnly = false) => request(`/products${activeOnly ? '?active=true' : ''}`),
  getById: (id) => request(`/products/${id}`),
  create: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

// ─── Posts ────────────────────────────────────────────────

export const posts = {
  getAll: (publishedOnly = false) => request(`/posts${publishedOnly ? '?published=true' : ''}`),
  getById: (id) => request(`/posts/${id}`),
  create: (body) => request('/posts', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
};

// ─── Media ────────────────────────────────────────────────

export const media = {
  getByPost: (postId) => request(`/media?postId=${postId}`),
  getById: (id) => request(`/media/${id}`),
  create: (body) => request('/media', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/media/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => request(`/media/${id}`, { method: 'DELETE' }),
};

// ─── Auth helpers ─────────────────────────────────────────

export function saveAuth(id, token) {
  localStorage.setItem('userId', id);
  localStorage.setItem('authToken', token);
}

export function clearAuth() {
  localStorage.removeItem('userId');
  localStorage.removeItem('authToken');
}

export function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
}

export function getUserId() {
  return typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
}

export function isLoggedIn() {
  return !!getToken();
}