# edunex-stores

Static download site for the EDUNEX Android apps (until the Play/App stores).


APKs are read live from this repo's GitHub Releases, tags:
`teacher-app-dev`, `student-app-dev`, `teacher-app-prod`, `student-app-prod`.
Publishing a new release under the same tag updates the page automatically.
Users install the new APK over the old one (same package name + signing key) to update.

## Private page URLs
The dev and prod pages live at unguessable paths and are not linked from anywhere:

- Prod: `/p-2840690b67132603/`
- Dev: `/d-3fb5d029e78bb722/`

Share only the matching link. `index.html` is a blank landing page and `robots` meta tags ask search engines not to index. `config.json` holds the teacher web URLs (edit only this to change them).
