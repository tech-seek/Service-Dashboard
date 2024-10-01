import { API_BASE_URL } from '@/app/config/env';


/**
 * Performs a fetch request to the given endpoint and returns the result as an
 * array of two elements. The first element is the parsed JSON response, and the
 * second element is an error if the request was not successful.
 *
 * @param endpoint The URL to fetch
 * @param body Optional body for POST requests
 * @param options Optional fetch options (e.g., headers, method)
 * @returns An array containing the parsed JSON response and an error if the request failed
 */
type TLog = { message?: string; success?: boolean } | undefined;
export const tryCatch = async <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
): Promise<[T | null, Error | null]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: options?.method ?? 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            next: { revalidate: 60 },
            body: body ? JSON.stringify(body) : undefined,
            ...options,
        });
        const data: T & TLog = (await response.json()) as T & TLog;
        if (!data?.success) {
            throw new Error(`${data?.message}`);
        }
        return [data, null];
    } catch (error) {
        if (error instanceof Error) {
            return [null, error];
        } else {
            return [null, new Error('An unknown error occurred')];
        }
    }
};