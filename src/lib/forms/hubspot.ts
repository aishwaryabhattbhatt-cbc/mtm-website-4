// Direct submission to HubSpot's unauthenticated Forms endpoint. Portal, form
// GUID and region all ship in the client bundle by design -- never put a
// Private App token anywhere near this file.

export interface HubspotField {
    name: string;
    value: string;
}

export interface HubspotTarget {
    portalId: string;
    formGuid: string;
    region: string;
}

// HubSpot's internal names for the `select_industry` property are the full
// labels, so the short slugs used in our markup have to be translated. A value
// outside this list is dropped silently, so these must stay in step with the
// property options in HubSpot.
export const HUBSPOT_INDUSTRY_VALUES: Record<string, string> = {
    media: 'Media and Broadcasting',
    advertising: 'Advertising and Marketing',
    govngo: 'Government and NGOs',
    education: 'Education and Research',
    industry: 'Industry',
    other: 'Other',
};

// The `language` property's internal names are the full labels, same as
// `select_industry`.
export const HUBSPOT_LANGUAGE_VALUES: Record<string, string> = {
    en: 'English',
    fr: 'French',
};

export class HubspotSubmitError extends Error {
    constructor(
        public readonly status: number,
        body: string
    ) {
        super(`HubSpot responded ${status}: ${body}`);
        this.name = 'HubspotSubmitError';
    }
}

export async function submitHubspotForm(
    { portalId, formGuid, region }: HubspotTarget,
    fields: HubspotField[]
): Promise<void> {
    // Set by the HubSpot tracking script; ties the submission to the visitor's
    // session. Absent on a first visit with cookies blocked, which is fine.
    const hutk = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/)?.[1];

    const response = await fetch(
        `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: fields.filter((field) => field.value !== ''),
                context: {
                    pageUri: window.location.href,
                    pageName: document.title,
                    ...(hutk ? { hutk } : {}),
                },
            }),
        }
    );

    if (!response.ok) {
        // The body names the offending field, which is the only practical way
        // to debug a rejection.
        throw new HubspotSubmitError(response.status, await response.text());
    }
}

/** Reads `data-hs-portal` / `data-hs-form` / `data-hs-region` off a form element. */
export function hubspotTargetFrom(form: HTMLFormElement): HubspotTarget {
    const { hsPortal = '', hsForm = '', hsRegion = '' } = form.dataset;
    return { portalId: hsPortal, formGuid: hsForm, region: hsRegion };
}
