import type { IRegistration, ITimeRange } from "@/interfaces";
import type { IOverlap } from "@/interfaces/IOverlap";

// Function to parse time range strings and return an object or error message
export function parseTimeRange(fromString: string, endString: string): ITimeRange {
    const start = parseInt(fromString);
    const end = parseInt(endString);
    let parseError = "";

    // Adjusting hours for 24-hour format
    const startTime = start < 1000 ? (start < 10 ? start * 100 : start) : start;
    const endTime = end < 1000 ? (end < 10 ? end * 100 : end) : end;

    // Calculating the duration using another function
    let durationResult = calculateTimeDifference(fromString, endString);

    // If the duration calculation results in an error, return it
    if (typeof durationResult === "string") {
        parseError = durationResult;
        durationResult = 0;
    }

    if (durationResult % 15 != 0) {
        parseError = `${fromString}-${endString} time ranges should be rounded to nearest quarter`;

        const remainder = durationResult % 15;
        // Round the duration to the nearest quarter by adding the necessary minutes
        durationResult += 15 - remainder;
    }

    // Return an object with parsed time range information
    return { startTime: startTime, endTime: endTime, duration: durationResult, parseError };
}

export function formatTime(_time: number | string): string {

    const time: number = parseInt(`${_time}`); // Ensure "time" is a number
    return `${time < 1000 ? `0${time}` : time}`;
}

// Function to calculate the time difference between two time strings
export function calculateTimeDifference(startTimeString: string, endTimeString: string): number | string {

    // Ensures the correct format for the string
    const startTime = formatTime(startTimeString);
    const endTime = formatTime(endTimeString);

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
export function checkForOverlap(registrations: IRegistration[]): IOverlap[] {
    const overlaps: IOverlap[] = [];

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
                        overlaps.push({
                            registrationA: registrationA.letter,
                            registrationB: registrationA.letter,
                            timeRangeA: timeRangeA,
                            timeRangeB: timeRangeB
                        });
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
                        overlaps.push({
                            registrationA: registrationA.letter,
                            registrationB: registrationB.letter,
                            timeRangeA: timeRangeA,
                            timeRangeB: timeRangeB
                        });
                    }
                }
            }
        }
    }

    // Return any overlaps found during the overlap check
    return overlaps;
}

// Function to calculate the total duration of a registration
export function calculateTotalTimeForRegistration(registration: IRegistration): number {
    return registration.timeRanges.reduce((result, current) => {
        return result + current.duration
    }, 0)
}

export function calculateTotalTime(registrations: IRegistration[]) {
    return (
        registrations
            .filter((registration) => !registration.showAsWarning)
            .reduce(
                (result, current) => result + calculateTotalTimeForRegistration(current),
                0
            ) / 60
    )
}

export function findGaps(registrations: IRegistration[]): ITimeRange[] {
    // Extract all time ranges into a single array
    const allTimeRanges: ITimeRange[] = [];
    const registrationIndexes: number[] = [];
    registrations.forEach((registration, registrationIndex) => {
        registration.timeRanges.forEach(timeRange => {
            allTimeRanges.push(timeRange);
            registrationIndexes.push(registrationIndex);
        });
    });

    // Sort all time ranges by start time
    const sortedTimeRanges = [...allTimeRanges];
    sortedTimeRanges.sort((a, b) => a.startTime - b.startTime);

    // Find gaps between all time ranges and their insertion indexes
    const gaps: ITimeRange[] = [];
    for (let i = 0; i < sortedTimeRanges.length - 1; i++) {
        const endTimeCurrent = sortedTimeRanges[i].endTime;
        const startTimeNext = sortedTimeRanges[i + 1].startTime;

        if (endTimeCurrent < startTimeNext) {
            const gapStartTime = endTimeCurrent;
            const gapEndTime = startTimeNext;
            const gapDuration = calculateTimeDifference(`${gapStartTime}`, `${gapEndTime}`) as number;

            gaps.push({ startTime: gapStartTime, endTime: gapEndTime, duration: gapDuration, parseError: "" });
        }
    }

    return gaps;
}
