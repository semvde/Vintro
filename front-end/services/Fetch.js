const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchAPI(endpoint, method = 'GET', body) {
    const headers = {
        "Accept": "application/json"
    };

    if (method === 'POST' || (method === 'PUT' && !(body instanceof FormData))) {
        headers["Content-Type"] = "application/json";
    }

    const token = localStorage.getItem('token');
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: method,
            headers: headers,
            body: body ? JSON.stringify(body) : null
        });

        const isApp = window.location.pathname.startsWith('/app');
        if (res.status === 401 && isApp) {
            localStorage.removeItem('token');
            return window.location.href = `${BASE_URL}/login`;
        }

        if (res.status === 204) return null;

        return await res.json();
    } catch (e) {
        return {
            items: [
                {
                    "error": "Something went wrong! Please try again later!",
                    "stack": e.stack
                }
            ]
        };
    }
}