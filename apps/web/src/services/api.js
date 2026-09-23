const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

function getAuthHeaders(extra = {}) {
  const token = localStorage.getItem('ss_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...extra
  };
}

function getAuthHeadersNoBody() {
  const token = localStorage.getItem('ss_auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// --- Auth ---

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// --- Customers ---

export async function fetchCustomers(search = '') {
  try {
    const res = await fetch(`${API_BASE}/customers?search=${encodeURIComponent(search)}`, {
      headers: getAuthHeadersNoBody()
    });
    const json = await res.json();
    return json.success ? json.data.customers : [];
  } catch (err) {
    console.warn('Backend API fetch error:', err);
    return [];
  }
}

export async function fetchCustomer(id) {
  try {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      headers: getAuthHeadersNoBody()
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function createCustomer(customerData) {
  try {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(customerData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateCustomer(id, updateData) {
  try {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteCustomer(id) {
  try {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeadersNoBody()
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function addInstruction(customerId, note, garmentType) {
  try {
    const res = await fetch(`${API_BASE}/customers/${customerId}/instructions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ note, garmentType })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// --- Staff ---

export async function fetchStaff() {
  try {
    const res = await fetch(`${API_BASE}/staff`, {
      headers: getAuthHeadersNoBody()
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function createStaff(staffData) {
  try {
    const res = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(staffData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function removeStaff(id) {
  try {
    const res = await fetch(`${API_BASE}/staff/${id}`, {
      method: 'DELETE',
      headers: getAuthHeadersNoBody()
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}
