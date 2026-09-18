import { ApiClientError, postJson } from '../forms/api';
import type { Locale } from '../cms/types';
import { actionHref, getCatalog, positiveId, resetCatalogCache, safeLocalPath } from './client';
import type { InsightCard, InsightsCatalog } from './client';

const base = import.meta.env.BASE_URL;
const cleanup = new WeakMap<HTMLElement, () => void>();
const localeFor = (section: HTMLElement): Locale =>
    section.closest<HTMLElement>('main')?.dataset.locale === 'fr' ? 'fr' : 'en';
const message = (locale: Locale, en: string, fr: string): string => (locale === 'fr' ? fr : en);
const sourcePath = (section: HTMLElement): string =>
    window.location.pathname + (section.id ? `#${section.id}` : window.location.hash);

type InsightsState = 'ready' | 'empty' | 'error';

function notifyRendered(section: HTMLElement, state: InsightsState = 'ready') {
    section.dataset.insightsState = state;
    section.dispatchEvent(
        new CustomEvent('insights:rendered', {
            bubbles: true,
            detail: {
                kind: section.dataset.insightsKind,
                state,
            },
        })
    );
}

function status(section: HTMLElement, text: string, retry = false) {
    const node = section.querySelector<HTMLElement>('[data-insights-status]');
    if (node) {
        node.textContent = text;
        node.hidden = !text;
    }
    const button = section.querySelector<HTMLButtonElement>('[data-insights-retry]');
    if (button) button.hidden = !retry;
    section.setAttribute('aria-busy', 'false');
}

function setText(root: HTMLElement, selector: string, text: string) {
    root.querySelectorAll<HTMLElement>(selector).forEach((node) => {
        node.textContent = text;
        node.removeAttribute('data-copy-key');
    });
}

function setImage(root: HTMLElement, selector: string, value: string | null, alt = '') {
    const src = safeLocalPath(value);
    root.querySelectorAll<HTMLImageElement>(selector).forEach((image) => {
        image.alt = alt;
        if (!src) {
            image.removeAttribute('src');
            image.hidden = true;
            return;
        }

        image.src = src;
        image.hidden = false;
        image.addEventListener(
            'error',
            () => {
                image.hidden = true;
            },
            { once: true }
        );
    });
}

function fillProducts(section: HTMLElement, root: HTMLElement, report: InsightCard) {
    const seed = root.querySelector<HTMLElement>('.product-pill');
    if (!seed) return;
    const anchor = seed.closest<HTMLElement>('[data-pill-variant]') ?? seed;
    const fragment = document.createDocumentFragment();
    for (const product of report.products) {
        // Product IDs originate in the API; compare strings instead of interpolating them into selectors.
        const template = [
            ...section.querySelectorAll<HTMLTemplateElement>('[data-insights-product-template]'),
        ].find((item) => item.dataset.insightsProductTemplate === product.id);
        const pill = template?.content.firstElementChild?.cloneNode(true) as
            | HTMLElement
            | undefined;
        const element = pill ?? document.createElement('span');
        element.textContent = product.name;
        fragment.append(element);
    }
    anchor.replaceWith(fragment);
}

function fillActions(
    section: HTMLElement,
    root: HTMLElement,
    report: InsightCard,
    catalog: InsightsCatalog,
    locale: Locale
) {
    const row = root.querySelector<HTMLAnchorElement>('a.reports-row');
    if (row) {
        const action = report.actions[0];
        const href = action && actionHref(report, action, catalog, locale, sourcePath(section));
        if (href) row.href = href;
        else row.removeAttribute('href');
        return;
    }
    const seed = root.querySelector<HTMLAnchorElement>('a.btn');
    if (!seed) return;
    const actions = document.createElement('div');
    actions.className = 'insights-actions';
    for (const action of report.actions) {
        const href = actionHref(report, action, catalog, locale, sourcePath(section));
        if (!href) continue;
        const link = seed.cloneNode(true) as HTMLAnchorElement;
        link.href = href;
        link.removeAttribute('data-copy-key');
        const label = link.querySelector<HTMLElement>(
            '.btn-tertiary-label, .free-report-card__download-btn > span, .sneak-peek-report-card__download-btn > span'
        );
        if (label) label.textContent = action.label;
        else link.textContent = action.label;
        actions.append(link);
    }
    seed.replaceWith(actions);
    actions.hidden = !actions.children.length;
}

function fillCard(
    section: HTMLElement,
    root: HTMLElement,
    report: InsightCard,
    catalog: InsightsCatalog,
    locale: Locale
) {
    root.dataset.reportId = String(report.id);
    root.dataset.reportProducts = report.products
        .map((product) => product.variant)
        .filter(Boolean)
        .join(' ');
    root.querySelectorAll('[data-copy-key]').forEach((node) =>
        node.removeAttribute('data-copy-key')
    );
    setText(
        root,
        '.report-card__title, .free-report-card__title, .featured-report-card__headline h2, .reports-row__title, .report-select-row__title, .sneak-peek-report-card__title',
        report.title
    );
    setText(
        root,
        '.report-card__description, .free-report-card__description, .featured-report-card__description, .sneak-peek-report-card__description',
        report.description || report.subheading
    );
    setText(root, '.sneak-peek-report-card__graph-name', report.graphTitle ?? '');
    setText(root, '.sneak-peek-report-card__graph-detail', report.graphDetail ?? '');
    setImage(root, '.sneak-peek-report-card__graph-icon', report.graphIconSrc);
    setImage(root, '.sneak-peek-report-card__chart', report.chartSrc, report.chartAlt ?? '');
    root.querySelectorAll<HTMLTimeElement>('time.date-pill').forEach((node) => {
        node.textContent = report.dateLabel;
        node.dateTime = report.publishedDate;
    });
    root.querySelectorAll<HTMLImageElement>(
        '.report-card__image, .free-report-card__image, .featured-report-card__image, .reports-row__thumbnail img, .report-select-row__image, .sneak-peek-report-card__image'
    ).forEach((image) => {
        const src = safeLocalPath(report.imageUrl);
        if (src) image.src = src;
        else {
            image.removeAttribute('src');
            image.hidden = true;
        }
        image.alt = '';
        image.addEventListener(
            'error',
            () => {
                image.hidden = true;
            },
            { once: true }
        );
    });
    fillProducts(section, root, report);
    const tags = root.querySelector<HTMLElement>('.report-card__tags, .featured-report-card__tags');
    if (tags) {
        const seed = tags.firstElementChild;
        tags.replaceChildren();
        if (seed)
            for (const tag of report.tags) {
                const node = seed.cloneNode(true) as HTMLElement;
                node.textContent = tag;
                tags.append(node);
            }
        tags.hidden = !tags.children.length;
    }
    const checkbox = root.querySelector<HTMLInputElement>('input[name="reports"]');
    if (checkbox) checkbox.value = String(report.id);
    fillActions(section, root, report, catalog, locale);
    root.classList.add('is-visible');
    root.querySelectorAll<HTMLElement>('.card-fly-in, .content-fly-in').forEach((node) =>
        node.classList.add('is-visible')
    );
}

function card(
    section: HTMLElement,
    report: InsightCard,
    catalog: InsightsCatalog,
    locale: Locale
): HTMLElement {
    const template = section.querySelector<HTMLTemplateElement>('[data-insights-card-template]');
    const root = template?.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
    if (!root) throw new Error('Missing report template');
    fillCard(section, root, report, catalog, locale);
    return root;
}

function initTicker(section: HTMLElement, track: HTMLElement, locale: Locale) {
    const count = track.children.length;
    const viewport = section.querySelector<HTMLElement>('.reports-ticker-viewport');
    const button = section.querySelector<HTMLButtonElement>('[data-ticker-pause]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!count || !viewport) return;
    if (track.scrollHeight <= viewport.clientHeight) {
        const observer = new ResizeObserver(() => {
            if (track.scrollHeight <= viewport.clientHeight) return;
            observer.disconnect();
            initTicker(section, track, locale);
        });
        observer.observe(track);
        observer.observe(viewport);
        cleanup.set(section, () => observer.disconnect());
        return;
    }
    for (const item of [...track.children]) {
        const duplicate = item.cloneNode(true) as HTMLElement;
        duplicate.setAttribute('aria-hidden', 'true');
        duplicate.inert = true;
        duplicate.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => (link.tabIndex = -1));
        track.append(duplicate);
    }
    let stopped = false;
    let paused = false;
    let index = 0;
    let timer = 0;
    let resetTimer = 0;
    if (button) {
        button.hidden = false;
        button.onclick = () => {
            paused = !paused;
            button.textContent = message(
                locale,
                paused ? 'Resume' : 'Pause',
                paused ? 'Reprendre' : 'Pause'
            );
            button.setAttribute('aria-pressed', String(paused));
        };
    }
    const step = () => {
        if (stopped) return;
        if (
            paused ||
            reduced.matches ||
            document.hidden ||
            section.matches(':hover, :focus-within')
        ) {
            timer = window.setTimeout(step, 500);
            return;
        }
        index++;
        const row = track.children[index] as HTMLElement;
        const first = track.firstElementChild as HTMLElement;
        track.style.transition = 'transform 1000ms cubic-bezier(0.65, 0, 0.35, 1)';
        track.style.transform = `translateY(-${row.offsetTop - first.offsetTop}px)`;
        if (index === count) {
            resetTimer = window.setTimeout(() => {
                track.style.transition = 'none';
                track.style.transform = 'translateY(0)';
                index = 0;
            }, 1050);
        }
        timer = window.setTimeout(step, 3500);
    };
    timer = window.setTimeout(step, 2500);
    cleanup.set(section, () => {
        stopped = true;
        window.clearTimeout(timer);
        window.clearTimeout(resetTimer);
        track.style.transform = '';
    });
}

interface LibraryControls {
    connect: (applyFilter: (value: string) => void) => void;
}

const validLibraryFilters = ['all', 'mtm18plus', 'junior', 'newcomers'];

function bindLibraryControls(section: HTMLElement): LibraryControls {
    let render: ((value: string) => void) | null = null;
    const listener = ((event: CustomEvent<{ value: string }>) => {
        const value = event.detail.value;
        if (!validLibraryFilters.includes(value)) return;
        section.dataset.filter = value;
        render?.(value);
    }) as EventListener;
    section.addEventListener('tabs:change', listener);
    cleanup.set(section, () => section.removeEventListener('tabs:change', listener));
    return {
        connect(applyFilter) {
            render = applyFilter;
            applyFilter(section.dataset.filter ?? 'all');
        },
    };
}

function initLibrary(
    section: HTMLElement,
    list: HTMLElement,
    catalog: InsightsCatalog,
    locale: Locale,
    controls: LibraryControls
) {
    const applyFilter = (value: string) => {
        const reports =
            value === 'all'
                ? catalog.reports
                : catalog.reports.filter((report) =>
                      report.products.some((product) => product.variant === value)
                  );
        list.replaceChildren(...reports.map((report) => card(section, report, catalog, locale)));
        list.scrollLeft = 0;
        status(
            section,
            reports.length
                ? ''
                : message(locale, 'No reports are available.', 'Aucun rapport disponible.')
        );
        notifyRendered(section);
    };
    controls.connect(applyFilter);
}

function initProduct(
    section: HTMLElement,
    report: InsightCard,
    catalog: InsightsCatalog,
    locale: Locale
) {
    const content = section.querySelector<HTMLElement>('[data-insights-product-content]');
    setText(section, '.product-reports-headline h2', report.title);
    setText(section, '.product-reports-description', report.description || report.subheading);
    setText(section, '.report-card-graph-name', report.graphTitle ?? '');
    setText(section, '.report-card-graph-detail', report.graphDetail ?? '');
    setImage(section, '.report-card-graph-icon', report.graphIconSrc);
    setImage(section, '.report-card-chart', report.chartSrc, report.chartAlt ?? '');
    const image = section.querySelector<HTMLImageElement>('.report-card-photo img');
    const src = safeLocalPath(report.imageUrl);
    if (image) {
        if (src) {
            image.src = src;
            image.hidden = false;
        } else {
            image.removeAttribute('src');
            image.hidden = true;
        }
    }
    if (content) content.hidden = false;
    const seed = section.querySelector<HTMLAnchorElement>('.report-action-buttons > a:last-child');
    if (seed) {
        const action = report.actions[0];
        const href = action && actionHref(report, action, catalog, locale, sourcePath(section));
        if (href) seed.href = href;
        else {
            seed.hidden = true;
            seed.removeAttribute('href');
        }
    }
    section
        .querySelectorAll<HTMLElement>('.heading-fly-in, .content-fly-in, .report-card-fly-in')
        .forEach((node) => node.classList.add('is-visible'));
}

function initDownload(section: HTMLElement, catalog: InsightsCatalog, locale: Locale) {
    const form = section.querySelector<HTMLFormElement>('[data-report-download-form]');
    const list = section.querySelector<HTMLElement>('[data-insights-list]');
    const submit = section.querySelector<HTMLButtonElement>('button[type="submit"]');
    const error = section.querySelector<HTMLElement>('[data-download-error]');
    if (!form || !list || !submit || !error) throw new Error('Missing download form');
    const params = new URLSearchParams(window.location.search);
    const requestedId = positiveId(params.get('reportId'));
    const requested = catalog.reports.find(
        (report) => report.id === requestedId && report.canRequest
    );
    const single = section.dataset.singleCard === 'true';
    const free = catalog.freeReportIds
        .map((id) => catalog.reports.find((report) => report.id === id))
        .filter((report): report is InsightCard => !!report?.canRequest);
    const available = single ? (requested ? [requested] : []) : [...free];
    if (!single && requested && !available.some((report) => report.id === requested.id))
        available.unshift(requested);
    if ((params.has('reportId') && !requested) || (single && !requested) || !available.length) {
        submit.disabled = true;
        status(
            section,
            message(
                locale,
                'This report is unavailable. Please return to Insights to choose an available report.',
                'Ce rapport est indisponible. Retournez à la page Perspectives pour choisir un rapport disponible.'
            )
        );
        return;
    }
    list.replaceChildren(
        ...available.map((report) => {
            const element = card(section, report, catalog, locale);
            const checkbox = element.querySelector<HTMLInputElement>('input[name="reports"]');
            if (checkbox) checkbox.checked = requestedId ? report.id === requestedId : true;
            return element;
        })
    );
    if (single) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'reports';
        input.value = String(requested!.id);
        form.querySelector('input[type="hidden"][name="reports"]')?.remove();
        form.append(input);
    }
    for (const [name, limit] of Object.entries({
        firstName: 100,
        lastName: 100,
        email: 250,
        organisation: 250,
        position: 250,
    })) {
        const input = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
        if (input) input.maxLength = limit;
    }
    const from = safeLocalPath(params.get('from'));
    document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
        const url = new URL(anchor.href, window.location.href);
        if (
            url.origin !== window.location.origin ||
            !/\/(en|fr)\/insights\/report-download(?:-2)?\/$/.test(url.pathname)
        )
            return;
        if (requestedId) url.searchParams.set('reportId', String(requestedId));
        if (from) url.searchParams.set('from', from);
        anchor.href = url.pathname + url.search;
    });
    submit.disabled = false;
    status(section, '');
    let submitting = false;
    const showError = (text: string) => {
        error.textContent = text;
        error.hidden = false;
        error.focus();
    };
    const listener = async (event: SubmitEvent) => {
        event.preventDefault();
        if (submitting) return;
        error.hidden = true;
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const ids = [...new Set(data.getAll('reports').map((value) => positiveId(String(value))))];
        if (!ids.length || ids.some((id) => !id) || ids.length > 10) {
            showError(
                message(
                    locale,
                    'Select between 1 and 10 reports.',
                    'Sélectionnez entre 1 et 10 rapports.'
                )
            );
            return;
        }
        submitting = true;
        submit.disabled = true;
        form.setAttribute('aria-busy', 'true');
        try {
            await postJson('/api/forms/report-download', {
                reportIds: ids,
                firstName: String(data.get('firstName') ?? '').trim(),
                lastName: String(data.get('lastName') ?? '').trim(),
                email: String(data.get('email') ?? '').trim(),
                organisation: String(data.get('organisation') ?? '').trim(),
                position: String(data.get('position') ?? '').trim(),
                locale,
                website: String(data.get('website') ?? '').trim(),
                pageName: document.title,
                pageUri: window.location.href,
            });
            const success = `${base}${locale}/insights/download-success/`;
            window.location.assign(from ? `${success}?from=${encodeURIComponent(from)}` : success);
        } catch (failure: unknown) {
            const text =
                failure instanceof ApiClientError && failure.status === 429
                    ? message(
                          locale,
                          'Too many requests. Please try again in 10 minutes.',
                          'Trop de demandes. Réessayez dans 10 minutes.'
                      )
                    : failure instanceof ApiClientError &&
                        failure.errorCode === 'report_unavailable'
                      ? message(
                            locale,
                            'A selected report is no longer available. Refresh this page and select your reports again.',
                            'Un rapport sélectionné est maintenant indisponible. Actualisez la page et sélectionnez de nouveau vos rapports.'
                        )
                      : failure instanceof ApiClientError && failure.status === 400
                        ? message(
                              locale,
                              'Please check the form fields, or refresh the page and try again.',
                              'Vérifiez les champs du formulaire ou actualisez la page et réessayez.'
                          )
                        : message(
                              locale,
                              'We could not complete your request. Please try again.',
                              'Votre demande n’a pas pu être traitée. Veuillez réessayer.'
                          );
            showError(text);
        } finally {
            submitting = false;
            submit.disabled = false;
            form.setAttribute('aria-busy', 'false');
        }
    };
    form.addEventListener('submit', listener);
    cleanup.set(section, () => form.removeEventListener('submit', listener));
}

async function hydrate(section: HTMLElement) {
    cleanup.get(section)?.();
    const locale = localeFor(section);
    const kind = section.dataset.insightsKind;
    const libraryControls = kind === 'library' ? bindLibraryControls(section) : null;
    section.dataset.insightsState = 'loading';
    status(section, message(locale, 'Loading reports…', 'Chargement des rapports…'));
    section.setAttribute('aria-busy', 'true');
    section
        .querySelectorAll<HTMLElement>('.heading-fly-in')
        .forEach((node) => node.classList.add('is-visible'));
    try {
        const catalog = await getCatalog(locale);
        const list = section.querySelector<HTMLElement>('[data-insights-list]');
        if (kind === 'download') {
            initDownload(section, catalog, locale);
            notifyRendered(section);
            return;
        }
        if (kind === 'library' && list) {
            initLibrary(section, list, catalog, locale, libraryControls!);
            return;
        }
        let reports: InsightCard[] = [];
        if (kind === 'ticker') reports = catalog.reports.slice(0, 8);
        else if (kind === 'free')
            reports = catalog.freeReportIds
                .map((id) => catalog.reports.find((report) => report.id === id))
                .filter((report): report is InsightCard => !!report);
        else {
            const id =
                kind === 'featured'
                    ? catalog.featuredReportId
                    : kind === 'infographic'
                      ? catalog.infographicReportId
                      : catalog.productSampleReportIds[section.dataset.productId ?? ''];
            reports = catalog.reports.filter((report) => report.id === id);
        }
        const optional = ['featured', 'infographic', 'product', 'free'].includes(kind ?? '');
        if (!reports.length && optional) {
            status(section, '');
            list?.replaceChildren();
            section.hidden = true;
            notifyRendered(section, 'empty');
            return;
        }
        section.hidden = false;
        if (kind === 'product') initProduct(section, reports[0], catalog, locale);
        else if (list)
            list.replaceChildren(
                ...reports.map((report) => card(section, report, catalog, locale))
            );
        status(
            section,
            reports.length
                ? ''
                : message(locale, 'No reports are available.', 'Aucun rapport disponible.')
        );
        notifyRendered(section);
        if (kind === 'ticker' && list)
            requestAnimationFrame(() => initTicker(section, list, locale));
    } catch {
        section.hidden = false;
        status(
            section,
            message(
                locale,
                'Reports could not be loaded. Please try again.',
                'Les rapports n’ont pas pu être chargés. Veuillez réessayer.'
            ),
            true
        );
        notifyRendered(section, 'error');
    }
}

function initialize() {
    document.querySelectorAll<HTMLElement>('[data-insights-kind]').forEach((section) => {
        if (section.dataset.insightsBound) return;
        section.dataset.insightsBound = 'true';
        const retry = section.querySelector<HTMLButtonElement>('[data-insights-retry]');
        if (retry)
            retry.onclick = () => {
                void hydrate(section);
            };
        void hydrate(section);
    });
}
initialize();
document.addEventListener('astro:page-load', initialize);
window.addEventListener('pagehide', () =>
    document
        .querySelectorAll<HTMLElement>('[data-insights-kind]')
        .forEach((section) => cleanup.get(section)?.())
);
window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    resetCatalogCache();
    document
        .querySelectorAll<HTMLElement>('[data-insights-kind]')
        .forEach((section) => delete section.dataset.insightsBound);
    initialize();
});
