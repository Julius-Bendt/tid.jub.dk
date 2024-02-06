const CACHE_KEY = "TIME_REGISTER_CACHE";

export function loadFromStorage() {
    return localStorage.getItem(CACHE_KEY) ?? "";
}

export function saveToStorage(input: string) {
    localStorage.setItem(CACHE_KEY, input)
}