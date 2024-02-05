import type { IRegistration } from "@/interfaces"
import { parseTimeRange } from "./TimeHelper";

// Regular expression patterns for matching specific formats in the input string
const ONLY_ID_REGEX_PATTERN = /(\d{4}-\d{4}): ([A-Z])/;
const WITH_DESCRIPTION_REGEX_PATTERN = /(\d{4}-\d{4}): ([A-Z]) - (.+)/;

// Function to extract information from input string with only an ID and time range
export function extractFromId(input: string): string | IRegistration {

    // Using the regular expression to match the expected pattern in the input
    const match = input.match(ONLY_ID_REGEX_PATTERN);

    // If no match is found, return an error message
    if (!match) {
        return `No match found for input: ${input}`;
    }

    // Extracting components from the match
    const timeRange = parseTimeRange(match[1]);
    const letter = match[2];

    // If the time range is a string (error message), return it
    if (typeof timeRange === "string") {
        return timeRange;
    }

    // Return an object with extracted information
    return {
        letter: letter,
        timeRanges: [timeRange],
        description: ""
    };
}

// Function to extract information from input string with an ID, time range, and description
export function extractWithDescription(input: string): string | IRegistration {

    // Using the regular expression to match the expected pattern in the input
    const match = input.match(WITH_DESCRIPTION_REGEX_PATTERN);

    // If no match or an invalid match is found, return an error message
    if (!match || match.length != 4) {
        return `No or invalid match found for input: ${input}`;
    }

    // Extracting components from the match
    const letter = match[2];
    const message = match[3];

    // Parsing the time range from the match
    const timeRange = parseTimeRange(match[1]);

    // If the time range is a string (error message), return it
    if (typeof timeRange === "string") {
        return timeRange;
    }

    // Return an object with extracted information
    return {
        letter: letter,
        timeRanges: [timeRange],
        description: message
    };
}