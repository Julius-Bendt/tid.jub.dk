import type { ITimeRange } from "./ITimeRange";

export interface IRegistration {
    letter: string;
    description: string;
    timeRanges: ITimeRange[];
    clicked: boolean;
    warnings: string[];
    errors: string[];
    showAsWarning: boolean;
}