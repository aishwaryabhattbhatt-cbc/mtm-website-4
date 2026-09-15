# Insights report display rules

This document describes the report-selection behaviour implemented by `InsightsService` and the Astro Insights runtime.

## 1. Base eligibility rules

A report enters the public Insights catalogue only when all of the following are true:

- **Visible to Public** (`IsPublic`) is selected.
- **Delist** (`IsDelisted`) is not selected.
- **Admin Preview** (`IsAdminPreview`) is not selected.
- **Publish Date** has a value.
- **Publish Date** is not later than the current UTC date and time.

The catalogue does not filter reports by `Report.Type`.

Unless a section defines another order, eligible reports are ordered by:

1. Publish Date, newest first.
2. Report ID, highest first, when Publish Dates are equal.

These rules are applied separately for the English and French API requests because the available file actions can differ by language.

## 2. What counts as an available action

Some sections require the report to have at least one usable action. A usable report file must:

- match the requested language exactly (`IsFileFrench = false` for English and `true` for French);
- have **Public** or **All** access; and
- have either a safe URL or a safe stored filename.

There is no English-document fallback when a French document is missing.

Action generation then works as follows:

- If **Email Catcher** is selected and at least one usable file exists, the report receives one **Download** request action. The user is sent through the report-download form rather than directly to the file.
- Otherwise, usable files become direct-download actions.
- If any file associated with the report is marked **Press Release File**, only usable files marked **Press Release File** become direct-download actions.
- If no file is marked **Press Release File**, all usable files become direct-download actions.

Files/actions are ordered by access value and then Report File ID. A custom localized file display name is used as the action label when one is available; otherwise the label is **Download** or **Télécharger**.

> Important: the press-release check examines all files attached to the report, not only files for the current language. If an English file is marked as a press-release file but no French press-release file exists, the French version can end up with no action even if it has another public French file.

## 3. Sections on the Insights page

| Section | Reports displayed | Order and limit | Empty behaviour |
| --- | --- | --- | --- |
| **Featured report below the hero** | The first base-eligible report with **Featured Report (Insights Hero)** selected. A usable action is **not** required. | Newest flagged report; one report only. | The entire section is hidden. |
| **Reports Library** | Every base-eligible report, including reports with no usable download/request action. | Publish Date descending, then Report ID descending. No client-side limit. | The section remains visible and displays a localized “No reports are available” message. |
| **Free Reports** | Every base-eligible report with **Free Report** selected **and** at least one usable action for the current language. | **Free Report Display Order** ascending; blank order values appear last. Ties are resolved by Publish Date descending, then Report ID descending. | The entire section is hidden. |
| **Free infographic** | The first base-eligible report with **Free Infographic** selected **and** at least one usable action for the current language. | Newest qualifying report; one report only. | The entire section is hidden. |

The **News** section on the page is separate from this report catalogue and is not selected by these report flags.

### Reports Library filters

The library starts on **All** and can filter reports by their related products:

| Filter | Required product relationship |
| --- | --- |
| All | None; shows the complete base-eligible catalogue. |
| MTM 18+ | Product ID `OG`. |
| Junior | Product ID `JR`. |
| Newcomers | Product ID `NC`. |

The existing `CT` product is mapped for card styling as Census, but it is not one of the accepted library filters in the current runtime.

## 4. Other report surfaces handled by the shared runtime

The same implementation also supports report sections outside the Insights page:

| Surface | Reports displayed | Order and limit | Empty behaviour |
| --- | --- | --- | --- |
| **Reports ticker** | The first eight reports in the base-eligible catalogue. A usable action is not required. | Publish Date descending, then Report ID descending; maximum eight. | The section stays visible and shows the localized empty message. |
| **MTM 18+ product sample** | The first base-eligible report with **MTM 18+ Product Sample** selected, a related `OG` product, and a usable action. | Newest qualifying report; one report only. | The entire section is hidden. |
| **Junior product sample** | The first base-eligible report with **Junior Product Sample** selected, a related `JR` product, and a usable action. | Newest qualifying report; one report only. | The entire section is hidden. |
| **Newcomers product sample** | The first base-eligible report with **Newcomers Product Sample** selected, a related `NC` product, and a usable action. | Newest qualifying report; one report only. | The entire section is hidden. |

The product-sample flag by itself is not enough: the report must also be related to the corresponding product and have a usable action in the current language.

## 5. Download-form selection

Only reports with **Email Catcher** selected and at least one usable file for the current language are requestable through the download form.

- The multi-report download page normally lists the requestable reports from the **Free Reports** set.
- If a valid requestable `reportId` is supplied in the URL but that report is not in the Free Reports set, it is inserted at the beginning of the list.
- The single-report download page shows only the valid requestable report named by `reportId`.
- Between 1 and 10 reports may be submitted.
- An invalid, unavailable, or no-longer-requestable report disables submission and displays an unavailable-report message.

The server revalidates the selected report IDs at submission time, so changing or delisting a report after the page loads prevents an outdated request from succeeding.

## 6. Localization behaviour

- English and French use the same base report records and editorial flags.
- French title, subheading, description, product name, file display name, and image filename fall back to English when the French text value is blank.
- Downloadable files do **not** fall back across languages.
- Because Free Reports, Free infographic, and product samples require an action, a report may appear in those sections in English but not French when it has no usable French file.
- The Featured report, Reports Library, and ticker can still display a report without an action.

## 7. Administrative examples

| Administration state | Result |
| --- | --- |
| A report is public, published, and not delisted, but **Admin Preview** is selected. | It appears nowhere in the public catalogue. |
| Several reports are marked **Featured Report**. | Only the newest eligible one is displayed. |
| Several reports are marked **Free Infographic**. | Only the newest one with a usable action is displayed. |
| A report is marked **Free Report**, but has no usable French file. | It can appear in the French Reports Library, but not in the French Free Reports section. |
| A report is marked for a product sample but is not related to that product. | It is not selected for that product sample section. |
| A report has several editorial flags selected. | It may intentionally appear in several sections. There is no cross-section deduplication. |
| A report has a future Publish Date. | It remains hidden until that UTC date and time is reached. |
| A report has no download/request action. | It may still appear as Featured, in the Reports Library, or in the ticker, but not in Free Reports, Free infographic, or product samples. |

## 8. Quick administration checklist

Before expecting a report to appear, confirm:

1. It satisfies all base eligibility rules.
2. The intended section flag is selected.
3. If the section requires an action, an appropriate public/all-access file exists for each language.
4. Product samples also have the corresponding product relationship.
5. Free reports have the intended **Free Report Display Order**.
6. Only the intended current report is selected for a one-report section such as Featured or Free infographic.

