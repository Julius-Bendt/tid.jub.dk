import type { IRegistration } from "@/interfaces"
import { parseTimeRange } from "./TimeHelper";

// Regular expression patterns for matching specific formats in the input string
// Group 1: Start time
// Group 2: End time
// Group 3: Letter
// Group 4: Description, optional
const MATCH_LINE = /(\d{4})\s?-\s?(\d{4}):\s?([a-zA-Z])(?:[-\s]+(.+))?/;

// Function to extract information from input string with an ID, time range, and description
export function extractWithDescription(input: string): string | IRegistration {

    // Using the regular expression to match the expected pattern in the input
    const match = input.match(MATCH_LINE);


    // If no match or an invalid match is found, return an error message
    if (!match || match.length != 5) {
        return `No or invalid match found for input: ${input}`;
    }

    // Extracting components from the match
    const letter = match[3].toUpperCase();
    const message = match[4];

    // Parsing the time range from the matches
    const timeRange = parseTimeRange(match[1], match[2]);

    // Return an object with extracted information
    return {
        letter: letter,
        timeRanges: [timeRange],
        description: message,
        clicked: false,
        warnings: [],
        errors: [timeRange.parseError],
        showAsWarning: false,
    };
}
