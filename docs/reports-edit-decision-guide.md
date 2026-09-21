# Report Edit Page: Decision Guide

**Purpose:** A plain-language inventory of the Report Edit page for decisions about what to keep, simplify, or eventually retire.  
**Updated:** September 20, 2026

## At a glance

The page supports several experiences at once: the new public Insights site, older public report pages, authenticated subscriber pages, and internal administration. This is why it contains fields that may look redundant.

No field should be removed solely because the new site does not use it. First confirm whether the older public pages and authenticated subscriber pages are still required.

| Decision category | Summary |
|---|---|
| Keep | Core report content, publishing controls, product access, files, bilingual tags, and Insights placements. |
| Keep temporarily | Legacy categories, colours, second buttons, keywords, and upcoming-release promotion—only while their older pages remain active. |
| Review for removal | The report-level download count appears unused; the file-level download count is the active measure. |
| Simplify | Status controls, tag/category management, and the very long single-page editing experience. |

## 1. Identity, products, and core content

| Field | What it controls | Where it is used | Suggested direction |
|---|---|---|---|
| `ProductId` | Returns the administrator to the correct product list. | Admin navigation only. | Keep as a technical field. |
| `Report.ReportId` | Identifies the report. | Everywhere. | Keep. |
| `IsOG`, `IsJR`, `IsNC` | Associates the report with MTM 18+, Junior, and/or Newcomers. | Public filtering, subscriber access, API output, download authorization, and product samples. | Keep, but present as one clear Products group. |
| `Report.Type` | Describes the kind of report. | Older pages, subscriber pages, filters, emails, and the API. | Keep. |
| `Report.PublishDate` | Controls release timing and ordering. | All report listings, downloads, and the API. | Keep; explain the time zone and publication state. |
| `Report.TitleEn`, `Report.TitleFr` | English and French titles. | All user-facing channels. | Keep; show translation completeness. |
| `Report.SubheadingEn`, `Report.SubheadingFr` | English and French supporting headings. | Home/dashboard presentations, emails, and the API. | Keep. |
| `Report.DescEn`, `Report.DescFr` | English and French descriptions. | Public catalog, subscriber pages, emails, and the API. | Keep. |
| `Report.Keywords` | Search terms for authenticated users. | Subscriber report search and admin listing; not used as public tags. | Keep only while subscriber search remains. |

## 2. Publishing and visibility

| Field | What it controls | Where it is used | Suggested direction |
|---|---|---|---|
| `Report.IsPublic` | Allows anonymous visitors to see the report. | Public pages, Insights, and public download checks. | Keep, but relabel clearly. |
| `Report.IsAdminPreview` | Holds a report from normal publication while allowing administrator preview. | Older pages, subscriber pages, Insights eligibility, and downloads. | Replace eventually with a clearer status such as Draft or Preview. |
| `Report.IsUpcomingRelease` | Promotes a future report. | Authenticated dashboard and admin list only. | Keep only while that dashboard feature remains. |
| `Report.IsEmailCatcher` | Requires visitors to provide details before receiving a public download. | Older public request flow and new Insights request flow. | Keep; explain that authenticated users may still download directly. |
| `Report.IsDelisted` | Removes a report from listings without deleting it. | All catalogs and non-admin downloads. | Keep; consider renaming to Archived or Withdrawn. |

## 3. Main images and older home-page presentation

| Field | What it controls | Where it is used | Suggested direction |
|---|---|---|---|
| `FileUploadImageEn`, `Report.ImageFileNameEn` | English report image and its stored filename. | Older public pages, subscriber pages, admin preview, and Insights. | Keep. Filename should remain system-managed. |
| `FileUploadImageFr`, `Report.ImageFileNameFr` | Optional French report image and stored filename. | Same channels; English image is the fallback. | Keep. Filename should remain system-managed. |
| `Report.TextColour` | Text colour on the older public home feature. | Older home page and admin preview only. | Retire when the older home feature is retired. |
| `Report.GradientColour` | Background/gradient colour on the older home feature. | Older home page and admin preview only. | Same as above. |
| `Report.SecondButtonTextEn`, `Report.SecondButtonUrlEn` | English secondary call-to-action. | Older home page and admin preview only. | Retire with the older home feature. |
| `Report.SecondButtonTextFr`, `Report.SecondButtonUrlFr` | French secondary call-to-action. | Older home page and admin preview only. | Retire with the older home feature. |

## 4. Tags and older categories

| Field/control | What it controls | Where it is used | Suggested direction |
|---|---|---|---|
| `reportTagSearch` | Searches existing tags in either language. | Admin Edit only. | Keep. |
| `reportTagSelect` | Selects a previously created bilingual tag. | Admin Edit only. | Keep. |
| `SelectedReportTagIds[]` | Saves the existing tags assigned to the report. | New public Insights tags. | Keep as a technical field. |
| `newReportTagEn`, `newReportTagFr` | Collects both language values for a new tag. | Admin Edit only. | Keep; both languages should remain required. |
| `NewReportTags[].NameEn`, `NewReportTags[].NameFr` | Saves new bilingual tags and associates them with the report. | Shared tag list and localized Insights output. | Keep as technical fields. |
| `Report.IsTV` | Older Television/Video category. | Legacy report filter and admin list; no longer supplies Insights tags. | Keep temporarily, then migrate/retire with the old filter. |
| `Report.IsRadio` | Older Radio/Audio category. | Legacy report filter and admin list. | Same as above. |
| `Report.IsInternet` | Older Internet category. | Legacy report filter and admin list. | Same as above. |
| `Report.IsMobile` | Older Mobile category. | Legacy report filter and admin list. | Same as above. |
| `Report.IsDemographic` | Older Demographics category. | Legacy report filter and admin list. | Same as above. |
| `Report.IsMarket` | Older Markets category. | Legacy report filter and admin list. | Same as above. |

## 5. Insights and Solutions placement

| Field | What it controls | Where it is used | Suggested direction |
|---|---|---|---|
| `Report.IsFeaturedReport` | Selects the main Insights feature. | New Insights site and admin list. | Keep. |
| `Report.IsFreeReport` | Includes the report in the free-reports collection. | New Insights site and admin list. | Keep. |
| `Report.FreeReportOrder` | Orders free reports. | New Insights site and admin list. | Keep; a drag-and-drop order would be easier. |
| `Report.IsFreeInfographic` | Selects the free infographic. | New Insights site and admin list. | Keep. |
| `Report.IsOgProductSample` | Selects the MTM 18+ sample. | New Solutions/product presentation. | Keep. |
| `Report.IsJrProductSample` | Selects the Junior sample. | New Solutions/product presentation. | Keep. |
| `Report.IsNcProductSample` | Selects the Newcomers sample. | New Solutions/product presentation. | Keep. |

## 6. Graph and chart presentation

| Field | What it controls | Where it is used | Suggested direction |
|---|---|---|---|
| `Report.GraphIconFileName`, `FileUploadGraphIcon` | Selects or uploads the small graph icon. | New free-infographic and product-sample presentations. | Keep. Stored filename should remain system-managed. |
| `Report.GraphTitle`, `Report.GraphTitleFr` | English and French graph titles. | New Insights presentation. | Keep; show translation completeness. |
| `Report.GraphDetail`, `Report.GraphDetailFr` | English and French graph details. | New Insights presentation. | Keep. |
| `FileUploadChart`, `Report.ChartFileName` | Uploads and identifies the English chart. | New Insights presentation. | Keep. Stored filename should remain system-managed. |
| `FileUploadChartFr`, `Report.ChartFileNameFr` | Uploads and identifies the French chart. | New Insights presentation; English chart can be the fallback. | Keep. Stored filename should remain system-managed. |
| `Report.ChartAlt`, `Report.ChartAltFr` | Accessible descriptions for English and French charts. | New Insights presentation and screen readers. | Keep and require when a chart conveys information. |

## 7. Downloadable files and links

Each report can have several file/link records. These fields determine language, audience, labels, and what is actually delivered.

| Field | What it controls | Where it is used | Suggested direction |
|---|---|---|---|
| `AddFileCount` | Adds blank file rows to the editor. | Admin Edit only. | Replace eventually with an immediate “Add file” action. |
| `Report.Files[].ReportFileId` | Identifies the file record. | All download/request paths. | Keep as system-managed. |
| `Report.Files[].ReportId` | Links the file to its report. | Database relationship and storage. | Keep as system-managed. |
| `Report.Files[].DownloadCount` | Counts deliveries of that file. | Download reporting. | Keep, but never expose as editable browser state. |
| `Report.Files[].FileName` | Identifies the stored file. | File delivery and logging. | Keep as system-managed. |
| `Report.Files[].Deleted` | Marks a file row for deletion. | Admin Edit only. | Replace eventually with a clearer dedicated delete action. |
| `Report.Files[].Access` | Defines who may receive the file. | Public and authenticated download authorization. | Keep; explain the access levels in plain language. |
| `Report.Files[].Url` | Uses an external link instead of an uploaded file. | Older pages, subscriber pages, API delivery, and logging. | Keep. |
| `Report.Files[].DisplayNameEn`, `Report.Files[].DisplayNameFr` | English and French download labels. | Public, subscriber, and API links/actions. | Keep. |
| `Report.Files[].FileUpload` | Uploads or replaces the document. | File delivery. | Keep. |
| `Report.Files[].IsFileFrench` | Identifies the file as French rather than English. | Language-specific file selection. | Keep; a clearer Language choice would be easier than a checkbox. |
| `Report.Files[].IsPressReleaseFile` | Chooses which public files become press-release actions. | New Insights only. | Keep, but relabel to describe the public behavior more clearly. |

## 8. Other technical state

| Field | What it controls | Where it is used | Suggested direction |
|---|---|---|---|
| `Report.DownloadCount` | Older report-level counter. It is not edited or incremented by the current delivery flow. | Admin report list only. | Confirm reporting needs, then remove if unused. |
| Hidden image/chart filenames | Preserve existing assets during form submission. | Admin save process. | Keep the data, but move ownership to the server rather than the browser. |

## UX recommendations

### 1. Organize the editor around administrator tasks

Use tabs or clearly separated steps: **Content**, **Publishing**, **Tags & products**, **Files & access**, **Insights presentation**, and **Legacy settings**. Keep a visible Save action and add a summary showing missing French content or files.

### 2. Replace overlapping switches with a clear publication status

Administrators currently have to interpret Public, Admin Preview, Upcoming Release, Delisted, and the publish date together. A single status such as **Draft, Preview, Scheduled, Published, or Archived** would be easier and safer. Show a short “Visible on” summary before saving.

### 3. Finish the transition to shared tags

Keep the new bilingual tag picker, but add a small central Tag Management page for renaming, merging, retiring, and viewing usage. Once the older report filters are no longer needed, migrate the six legacy categories into tags and remove the duplicate controls.

## Decisions needed from the MTM team

1. Which older public report and home-page experiences will remain after the new site is fully launched?
2. Will the authenticated subscriber report pages and upcoming-release feature remain?
3. Should the six older categories eventually become ordinary bilingual tags?
