# edunex-stores

Static download site for the EDUNEX Android apps (until the Play/App stores).


APKs are read live from this repo's GitHub Releases, tags:
`teacher-app-dev`, `student-app-dev`, `teacher-app-prod`, `student-app-prod`.
Publishing a new release under the same tag updates the page automatically.
Users install the new APK over the old one (same package name + signing key) to update.

## Private page URLs
The dev and prod pages live at paths that are not linked from anywhere:

- Prod: `/eg_edunex/`
- Dev: `/dev_hub_7k3q/`

Share only the matching link. `index.html` is a blank landing page and `robots` meta tags ask search engines not to index. `config.json` holds the teacher web URLs (edit only this to change them).

## Languages
Every page is bilingual (English / العربية). The language follows the visitor's phone language by default, and a button at the top switches it (the choice is remembered). Texts live in `app.js` (the `T` object).
