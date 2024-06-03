import type { ISearchItem } from "@/interfaces/ISearchItem";
import { loadDatesFromLocalStorage, loadFromStorage } from "./StorageService";
import { formatRegistrations } from "./RegistrationFormatterService";


export function searchLocalStorage(searchTerm: string): ISearchItem[] {

    if (searchTerm === "") return [];

    const dates = loadDatesFromLocalStorage()

    const items: ISearchItem[] = [];
    dates.forEach(date => {

        const lettersToInclude: string[] = [];
        const dataFromDate: string = loadFromStorage(date)

        const filteredLines = dataFromDate.split(/\r?\n/)
            .filter((datum) => {
                const letterMatch = datum.match(/: ([a-zA-Z])/); // Find the letter from a-z or A-Z
                const letter = letterMatch ? letterMatch[1] : null;

                // Include registration, if search term matches
                if (datum.includes(searchTerm) && letter) {
                    lettersToInclude.push(letter);
                    return true;
                }

                // We already included the assignment, now include additional periods
                if (letter && lettersToInclude.includes(letter)) {
                    return true;
                }

                return false;
            });

        if (filteredLines.length === 0) {
            return; // Continue equivalent
        }

        items.push({
            date: date,
            registrations: formatRegistrations(filteredLines, false, false),
        })

    });

    // Convert date string to Date object, then return the newest time as first
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
