const CACHE_KEY = "TIME_REGISTER_CACHE";

export function loadFromStorage(date: string) {
    const cacheKey = date == undefined ? CACHE_KEY : `${date}_${CACHE_KEY}`;
    return localStorage.getItem(cacheKey) ?? "";
}

export function saveToStorage(input: string) {

    localStorage.setItem(CACHE_KEY, input)

    const timestamp: string = getCurrentDate();
    localStorage.setItem(`${timestamp}_${CACHE_KEY}`, input)
}


function getCurrentDate(): string {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    return `${year}_${month}_${day}`;
}