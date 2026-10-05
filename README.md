# edunex-stores

Static download site for the EDUNEX Android apps (until the Play/App stores).

| Page | Purpose |
|---|---|
| `index.html` | Chooser: Production or Development |
| `prod.html` | Prod teacher + student APKs, teacher prod web link |
| `dev.html` | Dev teacher + student APKs, teacher dev web link |
| `config.json` | Teacher web URLs for dev and prod — edit this, nothing else |

APKs are read live from this repo's GitHub Releases, tags:
`teacher-app-dev`, `student-app-dev`, `teacher-app-prod`, `student-app-prod`.
Publishing a new release under the same tag updates the page automatically.
Users install the new APK over the old one (same package name + signing key) to update.
