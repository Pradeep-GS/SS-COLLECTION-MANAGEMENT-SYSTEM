const rawApiUrl = (import.meta.env.VITE_API_URL || '/api/v1').trim().replace(/\/+$/, '');
const API_BASE = rawApiUrl.endsWith('/api/v1')
  ? rawApiUrl
  : (rawApiUrl.startsWith('http') ? `${rawApiUrl}/api/v1` : rawApiUrl);


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

async function parseResponse(res) {
  try {
    const text = await res.text();
    if (!text) {
      return { 
        success: res.ok, 
        error: res.ok ? null : `Server returned status ${res.status} (${res.statusText || 'Empty response'})` 
      };
    }
    try {
      return JSON.parse(text);
    } catch {
      return { 
        success: false, 
        error: `Server error (${res.status}): ${text.slice(0, 150)}` 
      };
    }
  } catch (err) {
    return { success: false, error: err.message || 'Network request failed' };
  }
}

// --- Auth ---

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await parseResponse(res);
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
    const json = await parseResponse(res);
    return json.success ? (json.data?.customers || []) : [];
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
    return await parseResponse(res);
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
    return await parseResponse(res);
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
    return await parseResponse(res);
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
    return await parseResponse(res);
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
    return await parseResponse(res);
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
    return await parseResponse(res);
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
    return await parseResponse(res);
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
    return await parseResponse(res);
  } catch (err) {
    return { success: false, error: err.message };
  }
}
