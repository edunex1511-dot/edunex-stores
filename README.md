# edunex-stores

Static download site for the EDUNEX apps (until the Play/App stores).

APKs are read live from this repo's GitHub Releases, tags:
`teacher-app-dev`, `student-app-dev`, `teacher-app-prod`, `student-app-prod`.
Publishing a new release under the same tag updates the page automatically.
Users install the new APK over the old one (same package name + signing key) to update.

## Pages
Paths are not linked from anywhere; share only the matching link.

| Path | What it holds |
| --- | --- |
| `/student_app/` | Student app (prod) APK + screenshots |
| `/teacher_app/` | Teacher app (prod) APK, teacher web link, app + web screenshots |
| `/admin_panel/` | Admin panel (prod) web link |
| `/dev_hub_7k3q/` | All dev builds: student APK, teacher APK + web, admin panel web |
| `/eg_edunex/` | Old prod link, now a small chooser to the three prod pages |

`index.html` is a blank landing page. All pages use the light theme (no dark mode).

## Config (`config.json`)
- `dev` / `prod` → `teacherWebUrl`, `adminWebUrl`: the web links shown on the pages.
- `screenshots` → file names per gallery: `student` (`screenshots/student/`),
  `teacher-app` (`screenshots/teacher-app/`), `teacher-web` (`screenshots/teacher-web/`).
  Drop the images in the folder and list their file names here; empty lists show a "coming soon" note.

## Code layout
`js/strings.js` (en/ar texts), `js/core.js` (language + helpers + config loader),
`js/apk-card.js`, `js/web-card.js`, `js/gallery.js` (components), `js/pages.js`
(per-page layouts), `js/page.js` (bootstrap). To add a page: add a layout in `pages.js`,
texts in `strings.js`, and a folder with an `index.html` copied from an existing page.

## Languages
Every page is bilingual (English / العربية). The language follows the visitor's phone language by default, and a button at the top switches it (the choice is remembered).
