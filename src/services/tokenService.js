const TOKEN_KEY = 'fsad-auth-token';
const LEGACY_TOKEN_KEY = 'jwtToken';

export function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function setStoredToken(token) {
    if (!token) {
        clearStoredToken();
        return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function clearStoredToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
}
