import { CACHE_KEY, loadDatesFromLocalStorage, loadFromStorage } from "./StorageService";

export function exportRegistrations() {
    const dates = loadDatesFromLocalStorage().sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const data = {};
    dates.forEach(date => {
        const dataFromDate: string = loadFromStorage(date)
        data[date] = dataFromDate;
    });
    const filename = `${dates[dates.length - 1]} - ${dates[0]}`;
    saveObjectAsJson(data, filename);
}

export async function importRegistrations(file: File) {

    try {
        const jsonData = await readFileAsJson(file);
        const dateObject = JSON.parse(jsonData);

        Object.entries(dateObject).forEach(
            ([key, value]) => localStorage.setItem(`${key}_${CACHE_KEY}`.replace(/-/g, "_"), value as string)
        );
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
}

function saveObjectAsJson(obj: object, filename: string): void {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function readFileAsJson(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                if (e.target?.result) {
                    const jsonString = e.target.result as string;
                    resolve(jsonString);
                } else {
                    reject(new Error('FileReader result is empty'));
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsText(file);
    });
}