export const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
    let timeout: number;

    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

