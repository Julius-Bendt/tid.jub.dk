import { checkForOverlap, extractWithDescription, findGaps, formatTime } from "@/helpers"
import type { IRegistration, ITimeRange } from '@/interfaces'

import { useToast } from "vue-toast-notification"

export function formatRegistrations(input: Array<string>, insertOverlaps: boolean = true, insertGaps: boolean = true): IRegistration[] {
    let registrationArray: IRegistration[] = [];

    for (let inputString of input) {
        // Trim leading and trailing whitespaces
        inputString = inputString.trim()

        // Skip empty lines
        if (inputString === '') {
            continue
        }

        // Determine whether the input string contains a description and parse accordingly
        const extractResult = extractWithDescription(inputString)

        // If the result is a string, it is an error message, add it to errors and return
        if (typeof extractResult === 'string') {
            const $toast = useToast()
            $toast.clear()
            $toast.error(`failed to extract time registrations: ${extractResult}`)
            continue;
        }

        // Set or add the registration to the formatted registrations
        updateOrAddRegistration(extractResult, registrationArray);
    }

    // Find and insert overlaps
    if (insertOverlaps) {
        registrationArray = insertOverlapsToArray(registrationArray);

    }

    // Find and insert gaps
    if (insertGaps) {
        registrationArray = insertGapsToArray(registrationArray);
    }


    return registrationArray;
}

function insertOverlapsToArray(registrationArray: IRegistration[]): IRegistration[] {
    // Check for overlap warnings among registrations
    const overlaps = checkForOverlap(registrationArray)
    overlaps.forEach((overlap) => {
        const registrationA = registrationArray.filter((registration => registration.letter === overlap.registrationA))[0];
        const registrationB = registrationArray.filter((registration => registration.letter === overlap.registrationB))[0];

        const startA = formatTime(overlap.timeRangeA.startTime);
        const endA = formatTime(overlap.timeRangeA.endTime);
        const startB = formatTime(overlap.timeRangeB.startTime);
        const endB = formatTime(overlap.timeRangeB.endTime);


        // if registration A and B are the same
        if (overlap.registrationA === overlap.registrationB) {
            const warning = `Overlap between ${startA}-${endA} and ${startB}-${endB}`;

            // Only show the overlap with lowest start time.
            // Otherwise, two warnings will be produced
            if (overlap.timeRangeA.startTime > overlap.timeRangeB.startTime) {
                return;
            }

            // Don't add same warning twice 
            if (registrationA.warnings.includes(warning) || registrationB.warnings.includes(warning)) {
                return;
            }

            const index = registrationArray.findIndex((registration) => registration.letter === registrationA.letter);
            registrationArray[index].warnings.push(warning);

            return;
        }

        const indexA = registrationArray.findIndex((registration) => registration.letter === registrationA.letter);
        const indexB = registrationArray.findIndex((registration) => registration.letter === registrationB.letter);

        registrationArray[indexA].warnings.push(`Overlaps with '${overlap.registrationB}' between ${startA}-${endA} and ${startB}-${endB}`);
        registrationArray[indexB].warnings.push(`Overlaps with '${overlap.registrationA}' between ${startA}-${endA} and ${startB}-${endB}`);
    })

    return registrationArray;
}

function insertGapsToArray(registrationArray: IRegistration[]): IRegistration[] {
    const gaps = findGaps(registrationArray);

    let gapKey: string = "";
    gaps.forEach((gap: ITimeRange) => {

        const startTime = formatTime(gap.startTime);
        const endTime = formatTime(gap.endTime);

        gapKey += "_";
        registrationArray.push({
            letter: gapKey,
            clicked: false,
            description: `Gap between ${startTime} - ${endTime}`,
            errors: [],
            showAsWarning: true,
            timeRanges: [gap],
            warnings: []
        })
    })

    return registrationArray;
}

function updateOrAddRegistration(input: IRegistration, registrationArray: IRegistration[]) {
    const timeRanges: ITimeRange[] = [...input.timeRanges]
    let description = input.description ?? ''
    let clicked: boolean = input.clicked ?? false
    const registrationWarnings: string[] = []
    const registrationErrors: string[] = timeRanges.map((timeRange) => timeRange.parseError);

    const index = registrationArray.findIndex((registration) => registration.letter === input.letter);
    if (index === -1) { // Simply add the new registration, if an old one doesn't exists yet
        registrationArray.push(input);
        return registrationArray;
    }

    const oldRegistration: IRegistration = registrationArray[index];

    // Not really needed, but static code analysis kept complaining
    if (!oldRegistration) {
        console.error('Something went wrong finding this registration:', input)
        return
    }

    // If the old registration has a description, and the new registration also has a description, add an error
    if (!!oldRegistration.description && !!input.description) {
        registrationWarnings.push(`ID '${input.letter}' has multiple descriptions`)
    }

    description = oldRegistration.description || input.description
    clicked = oldRegistration.clicked || input.clicked

    // Add old registration's time ranges to the new registration
    timeRanges.push(...oldRegistration.timeRanges)

    // Set the registration in the formatted registrations map
    registrationArray[index] = {
        letter: input.letter,
        timeRanges: timeRanges,
        description: description,
        clicked: clicked,
        warnings: registrationWarnings,
        errors: registrationErrors,
        showAsWarning: false,
    };

    return registrationArray;
}


