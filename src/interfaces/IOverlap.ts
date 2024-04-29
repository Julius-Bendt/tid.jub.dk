import type { ITimeRange } from "./ITimeRange";

export interface IOverlap {
    registrationA: string;
    registrationB: string;
    timeRangeA: ITimeRange;
    timeRangeB: ITimeRange;
}
