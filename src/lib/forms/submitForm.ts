/**
 * Shared submit path for the four public lead forms (demo, newsletter, report
 * download, contact). Each form posts here, then redirects or opens its own
 * success state depending on the result.
 *
 * Sent as a urlencoded form post rather than JSON so the handler can read it
 * with no special casing — `interests` simply repeats when several boxes are
 * ticked.
 */
export async function submitForm(form: HTMLFormElement, endpoint: string): Promise<boolean> {
    // Guards against a double-click on a slow connection creating two leads.
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (button) button.disabled = true;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>),
        });
        return response.ok;
    } catch {
        return false;
    } finally {
        if (button) button.disabled = false;
    }
}

/**
 * The endpoint is unset until the backend handler exists, and stays unset in
 * local dev. Treating that as success keeps every form behaving exactly as it
 * did before this was wired, so the change can ship ahead of the handler.
 */
export async function submitFormIfConfigured(form: HTMLFormElement): Promise<boolean> {
    const endpoint = form.dataset.formEndpoint;
    return endpoint ? submitForm(form, endpoint) : true;
}
