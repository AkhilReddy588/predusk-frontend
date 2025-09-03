const API_URL = import.meta.env.VITE_API_URL

async function api(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = token

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  })

  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg || `Error: ${res.status}`)
  }

  return res.json()
}

export { api }
