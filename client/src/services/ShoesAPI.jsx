// client/src/services/ShoesAPI.js

// Auto-detect API base (default = /api)
const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || '/api';

// helper for JSON requests
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || res.statusText || 'Request failed');
  }
  return data;
}

// --- Shoes API functions ---
export async function getAllShoes() {
  return request('/shoes');
}

export async function getShoe(id) {
  return request(`/shoes/${id}`);
}

export async function createShoe(payload) {
  return request('/shoes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateShoe(id, payload) {
  return request(`/shoes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteShoe(id) {
  return request(`/shoes/${id}`, { method: 'DELETE' });
}

// export as object for convenience
const ShoesAPI = {
  getAllShoes,
  getShoe,
  createShoe,
  updateShoe,
  deleteShoe,
};

export default ShoesAPI;
