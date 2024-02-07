import type { IRegistration, ITimeRange } from "@/interfaces";

// Function to parse time range strings and return an object or error message
export function parseTimeRange(fromString: string, toString: string): ITimeRange | string {
    const start = parseInt(fromString);
    const end = parseInt(toString);

    // Adjusting hours for 24-hour format
    const startTime = start < 1000 ? (start < 10 ? start * 100 : start) : start;
    const endTime = end < 1000 ? (end < 10 ? end * 100 : end) : end;

    // Calculating the duration using another function
    const durationResult = calculateTimeDifference(fromString, toString);

    // If the duration calculation results in an error, return it
    if (typeof durationResult === "string") {
        return durationResult;
    }

    // Return an object with parsed time range information
    return { startTime: startTime, endTime: endTime, duration: durationResult };
}

// Function to calculate the time difference between two time strings
export function calculateTimeDifference(startTime: string, endTime: string): number | string {
    // Parse the time strings
    const startHours = parseInt(startTime.slice(0, 2))
    const startMinutes = parseInt(startTime.slice(2))
    const endHours = parseInt(endTime.slice(0, 2))
    const endMinutes = parseInt(endTime.slice(2))

    // Calculate the time in minutes for both start and end
    const startTimeInMinutes = startHours * 60 + startMinutes
    const endTimeInMinutes = endHours * 60 + endMinutes

    // Calculate the time difference
    const timeDifference = endTimeInMinutes - startTimeInMinutes

    // Handle cases where end time is before start time
    if (timeDifference < 0) {
        return `End time (${endTime}) is before start time (${startTime})`;
    }

    // Return the calculated time difference
    return timeDifference
}

// Function to check for overlaps in time ranges among registrations
export function checkForOverlap(registrations: IRegistration[]): string[] {
    const errors: string[] = [];

    // Iterate through each registration
    for (let i = 0; i < registrations.length; i++) {
        const registrationA = registrations[i];

        // Iterate through each time range in the registration
        for (let j = 0; j < registrationA.timeRanges.length; j++) {
            const timeRangeA = registrationA.timeRanges[j];

            // Check for overlaps within the same registration
            for (let k = 0; k < registrationA.timeRanges.length; k++) {
                if (k !== j) {
                    const timeRangeB = registrationA.timeRanges[k];
                    if (
                        (timeRangeA.startTime < timeRangeB.endTime && timeRangeA.endTime > timeRangeB.startTime) ||
                        (timeRangeB.startTime < timeRangeA.endTime && timeRangeB.endTime > timeRangeA.startTime)
                    ) {
                        errors.push(`${registrationA.letter}: Overlap within the same registration between ${timeRangeA.startTime}-${timeRangeA.endTime} and ${timeRangeB.startTime}-${timeRangeB.endTime}`);
                    }
                }
            }

            // Check for overlaps with other registrations
            for (let l = i + 1; l < registrations.length; l++) {
                const registrationB = registrations[l];
                for (const timeRangeB of registrationB.timeRanges) {
                    if (
                        (timeRangeA.startTime < timeRangeB.endTime && timeRangeA.endTime > timeRangeB.startTime) ||
                        (timeRangeB.startTime < timeRangeA.endTime && timeRangeB.endTime > timeRangeA.startTime)
                    ) {
                        errors.push(`${registrationA.letter} (${timeRangeA.startTime}-${timeRangeA.endTime}) and ${registrationB.letter} (${timeRangeB.startTime}-${timeRangeB.endTime}) overlap`);
                    }
                }
            }
        }
    }

    // Return any errors found during the overlap check
    return errors;
}

// Function to calculate the total duration of a registration
export function calculateTotalTimeForRegistration(registration: IRegistration): number {
    return registration.timeRanges.reduce((result, current) => {
        return result + current.duration
    }, 0)
}

export function calculateTotalTime(registrations: IRegistration[]) {
    return (
        registrations.reduce(
            (result, current) => result + calculateTotalTimeForRegistration(current),
            0
        ) / 60
    )
}
