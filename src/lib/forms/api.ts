export interface ApiResponse {
    errorCode?: string;
    errors?: string[];
}

interface ApiPayload {
    errorCode?: string;
    errors?: string[] | Record<string, string[]>;
}

interface AntiforgeryResponse {
    requestToken?: string;
}

export class ApiClientError extends Error {
    constructor(
        public readonly status: number,
        public readonly errorCode?: string,
        public readonly errors: string[] = []
    ) {
        super(errorCode || `API request failed with status ${status}.`);
        this.name = 'ApiClientError';
    }
}

export async function postJson<TRequest>(url: string, body: TRequest): Promise<ApiResponse> {
    const antiforgeryResponse = await fetch('/api/auth/antiforgery', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!antiforgeryResponse.ok) {
        throw new ApiClientError(antiforgeryResponse.status, 'antiforgery_error');
    }

    const antiforgery = (await antiforgeryResponse.json()) as AntiforgeryResponse;

    if (!antiforgery.requestToken) {
        throw new ApiClientError(500, 'antiforgery_error');
    }

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'XSRF-TOKEN': antiforgery.requestToken,
        },
        body: JSON.stringify(body),
    });

    let payload: ApiPayload = {};

    if (response.headers.get('content-type')?.includes('application/json')) {
        payload = (await response.json()) as ApiPayload;
    }

    const errors = Array.isArray(payload.errors)
        ? payload.errors
        : payload.errors
          ? Object.values(payload.errors).flat()
          : [];

    const result: ApiResponse = {
        errorCode: payload.errorCode,
        errors,
    };

    if (!response.ok) {
        throw new ApiClientError(response.status, result.errorCode, errors);
    }

    return result;
}
