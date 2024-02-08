const CACHE_KEY = "TIME_REGISTER_CACHE";

export function loadFromStorage(date: string | undefined = undefined) {
    const cacheKey = date == undefined ? CACHE_KEY : `${date}_${CACHE_KEY}`.replace(/-/g, "_");;
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

export function loadDatesFromLocalStorage(): string[] {
    // Check if localStorage is supported by the browser
    if (typeof localStorage === 'undefined') {
        console.error('localStorage is not supported in this browser.');
        return [];
    }
    // Get the number of items in localStorage
    const itemCount = localStorage.length;

    // Create an array to store the keys
    const keys: string[] = [];

    // Iterate through localStorage and push keys to the array
    for (let i = 0; i < itemCount; i++) {
        const key = localStorage.key(i)
            ?.replace(CACHE_KEY, "") // Remove cache key. 2024_02_07_TIME_REGISTER_CACHE --> 2024_02_07_
            .replace(/_/g, "-") // replaces "_" with "-". 2024_02_07_--> 2024-02-07-
            .slice(0, -1); // Remove the trailing "-". 2024-02-07- --> 2024-02-07

        if (key != "") {
            keys.push(key as string);
        }
    }

    return keys;
}

