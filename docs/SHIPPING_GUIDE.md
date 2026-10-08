# Shipping guide: teacher web, app releases, app patches

How code from the **edunex-flutter** repo reaches users, and how to do each
step **manually**. Reviewed against edunex-flutter `main` on 2026-10-08
(workflows `shorebird-release.yml`, `shorebird-patch.yml`,
`shorebird-promote.yml`, `deploy-teacher-web.yml`, and `docs/HOW_TO_SHIP.md`,
`docs/RELEASE_WORKFLOW.md`, `docs/shorebird.md` in that repo).

"Manually" has two meanings here, and both are covered:

- **Route 1, click a button (recommended).** GitHub Actions workflows in
  edunex-flutter that only run when you start them (**Actions** tab, **Run
  workflow**). Nothing is built on your computer.
- **Route 2, by hand on your computer.** The same commands the workflows run,
  typed yourself. Use it when Actions is down (it has been unreliable at
  times) or to debug a failing run.

## The big picture

| You ship | What it is | Where users get it |
| --- | --- | --- |
| **Teacher web app** | Flutter web build pushed to the `teachers.edunex` repo, deployed by Vercel | The web links (prod `https://teachersedunex.vercel.app/`, dev `https://teachersedunex-git-dev-edunex2.vercel.app/`) |
| **App release** (student / teacher, dev / prod) | A full Android APK built with Shorebird | The download pages of this repo (prod `/eg_edunex/`, dev `/dev_hub_7k3q/`), which read GitHub Releases in this repo |
| **App patch** | A Dart-only over-the-air fix on top of a release | Installed apps download it by themselves; no new APK |

How the three connect:

```
edunex-flutter (code)
  |-- Deploy Teacher Web  --> teachers.edunex repo --> Vercel --> web links
  |-- Shorebird Release   --> APK --> GitHub Release in edunex-stores
  |                                    (tag <app>-app-<flavor>) --> download pages
  |-- Shorebird Patch     --> Shorebird servers --> installed apps (next launch)
```

The download pages in this repo never need editing for a release: they read the
newest release for each tag, so uploading a new APK under the same tag updates
the page.

## Patch or release? Decide first

A patch can only carry **Dart code**. If the change touches any row marked
"release", the whole change needs a new release.

| Change | Path |
| --- | --- |
| Dart code in `lib/` or `packages/` (screens, logic, bug fixes) | **Patch** |
| New or upgraded package that has native code, or any `pubspec.yaml` dependency change | **Release** |
| `android/` or `ios/` changes (permissions, gradle, manifest) | **Release** |
| Assets: images, fonts, icons, `.env` files, `shorebird.yaml` | **Release** |
| Flutter version upgrade, base URL change, Firebase config change | **Release** |
| Force or suggest an update (Firebase Remote Config) | Neither, set in Firebase |
| Teacher **web** change | Web deploy (independent of both) |

If a patch run stops with an "asset" or "native" difference message, the change
is not patchable. Ship a release instead. Every pull request in edunex-flutter
gets a CI note saying "Dart-only" or "needs a new release".

## Facts that apply everywhere

- **Two apps, two flavors.** `student_app` and `teacher_app`, each with `dev`
  and `prod`. They have separate app ids, Firebase projects and Shorebird apps,
  so a dev patch can never reach prod users, and both install side by side.
- **Flutter version:** `3.44.1` (set in the release workflow and the shared
  workspace setup). Releases and the web build must use the same one.
- **Account:** Shorebird belongs to `edunex1511@gmail.com`. A key or login from
  another account fails with "Insufficient permissions".
- **Version rule:** `version: x.y.z+build` in `apps/<app>/pubspec.yaml`. The
  `+build` number is the Android versionCode, so it must go up on every
  release and is never reused. Patches never change it.
- **Never ship Android with plain `flutter build apk --release`.** A build made
  without Shorebird cannot receive patches.
- **Same signing key forever.** Android refuses to install an update signed with
  a different key. Keep each app's keystore safe; losing it means users must
  uninstall and reinstall.
- **Patches are built from "release code + the fix", nothing else.**

### Secrets and where they live

Repository secrets in **edunex-flutter** (Settings, Secrets and variables,
Actions). Only the names are listed here, never the values.

| Secret | Used for |
| --- | --- |
| `SHOREBIRD_TOKEN` | API key from console.shorebird.dev (account `edunex1511@gmail.com`) |
| `EDUNEX_STORES_DEPLOY_TOKEN` | Lets the release workflow upload the APK to this repo's releases |
| `TEACHERS_WEB_DEPLOY_TOKEN` | Lets the web workflow push to the `teachers.edunex` repo |
| `STUDENT_APP_DEV_BASE_URL`, `STUDENT_APP_PROD_BASE_URL`, and the `TEACHER_APP_...` pair | API address baked into each build |
| `<STUDENT or TEACHER>_APP_KEYSTORE_BASE64`, `_KEYSTORE_PASSWORD`, `_KEY_ALIAS`, `_KEY_PASSWORD` | Signs the release APK |

Backend addresses (from edunex-flutter `docs/running-the-apps.md`):
dev `https://edunex-server-git-develop-edunex2.vercel.app/api`, prod
`https://edunex-server.vercel.app/api`.

---

## A. Ship the teacher web app

Independent of app releases and patches. Deploy it after the server is deployed.

### Route 1: click

1. edunex-flutter, **Actions**, **Deploy Teacher Web**, **Run workflow**.
2. **Use workflow from:** the branch or tag you want to build (normally `dev` for
   dev, `main` for prod).
3. **environment:** `dev` (goes to the `dev` branch of `teachers.edunex`, a
   Vercel preview) or `prod` (the `main` branch, Vercel production).
4. Wait for green. The workflow analyzes, tests, builds, then pushes the build
   to `teachers.edunex`; Vercel deploys from that push.
5. Open the web link and hard-refresh. If the run says "No changes to deploy",
   the build was identical to what is already live.

### Route 2: by hand

Needs Flutter 3.44.1, Git, access to both repos, and the base URL for the
environment.

```bash
# 1. Get the code and prepare the workspace
git clone https://github.com/edunex1511-dot/edunex-flutter && cd edunex-flutter
git checkout <dev-or-main-or-tag>
dart pub get
dart run melos bootstrap
dart run melos run build_runner --no-select      # generated code is not in git

# 2. Env files (ENV is dev or prod; the three files must all exist)
cd apps/teacher_app
printf 'BASE_URL=%s\n' "https://edunex-server.vercel.app/api" > .env.prod
cp .env.prod .env.dev
cp .env.prod .env.local
# for a dev deploy, write the dev URL into .env.dev instead and copy it over the others

# 3. Check and build
flutter analyze && flutter test
flutter build web --release --dart-define=ENV=prod     # or ENV=dev

# 4. Publish: copy the build into the teachers.edunex repo and push
cd ../../..
git clone https://github.com/edunex1511-dot/teachers.edunex teachers-web && cd teachers-web
git checkout main          # prod. For dev: git checkout dev  (or git checkout -b dev if it does not exist)
git config user.name  "edunex1511-dot"
git config user.email "315265799+edunex1511-dot@users.noreply.github.com"
rsync -a --delete --exclude='.git' --exclude='vercel.json' --exclude='README.md' \
      --exclude='important_commands.md' ../edunex-flutter/apps/teacher_app/build/web/ ./
git add -A && git commit -m "deploy: teacher web (prod) from edunex-flutter@<sha>"
git push origin main       # or: git push origin dev
```

Notes:

- The noreply email matters: Vercel refuses commits whose author email does not
  match a real GitHub account.
- `--exclude` keeps `vercel.json` and the repo's own docs safe from `--delete`.
- Roll back by redeploying a previous deployment in the Vercel dashboard, or by
  reverting the commit in `teachers.edunex` and pushing.

---

## B. Ship an app release (new APK)

Use it for anything in the "release" rows of the decision table, and always for
the first build of a new version.

### Route 1: click

1. In edunex-flutter, raise the build number in `apps/<app>/pubspec.yaml`
   (for example `1.1.0+103` to `1.1.0+104`) and merge it to the branch you run
   from (`main` for prod, `dev` for dev, or `release/x.y.z`).
2. **Actions**, **Shorebird Release**, **Run workflow**, from that branch.
   - **app:** `student`, `teacher` or `both` (two parallel jobs, each uses its
     own pubspec version).
   - **flavor:** `prod` or `dev`.
3. Wait about 30 minutes. It frees disk space, sets up Flutter and Shorebird,
   writes the env files and keystore from secrets, runs `flutter analyze` and
   `flutter test`, runs `shorebird release android --flavor <f>
   --flutter-version=3.44.1 --artifact apk -- --no-tree-shake-icons`, then
   uploads `<app>-app-<flavor>.apk` to this repo's release tagged
   `<app>-app-<flavor>` (creating it the first time).
4. Verify:
   - `shorebird releases list --flavor <f>` (inside `apps/<app>`) shows the
     version as active.
   - The download page for that flavor shows the new build. **A new release
     replaces the APK behind the same link**, so the old build is no longer
     downloadable.
   - Install it on a phone and confirm it opens.
5. Afterwards: set `latest_build` in Firebase Remote Config (see section E),
   tag `main` (for example `student-1.1.0+104`), and update the live-releases
   table in edunex-flutter `docs/RELEASE_WORKFLOW.md`.

### Route 2: by hand

Needs Flutter 3.44.1, Android SDK and Java, the Shorebird CLI logged in as
`edunex1511@gmail.com` (`shorebird login`, check with `shorebird account whoami`),
this app's keystore file, the `gh` CLI logged in with upload rights to this repo,
and enough RAM (the project's `gradle.properties` asks for an 8 GB heap).

```bash
git clone https://github.com/edunex1511-dot/edunex-flutter && cd edunex-flutter
git checkout <branch-or-tag>
dart pub get
dart run melos bootstrap
dart run melos run build_runner --no-select
cd apps/<student_app-or-teacher_app>

# 1. Bump the version in pubspec.yaml (x.y.z+build, build must go up), commit it.

# 2. Env files. Dev and prod must hold DIFFERENT, real URLs (testers can switch).
printf 'BASE_URL=%s\n' "https://edunex-server-git-develop-edunex2.vercel.app/api" > .env.dev
printf 'BASE_URL=%s\n' "https://edunex-server.vercel.app/api"                      > .env.prod
cp .env.dev .env.local

# 3. Signing: put the keystore in place and write key.properties.
cp /safe/place/<app>-upload-keystore.jks android/app/upload-keystore.jks
cat > android/key.properties <<'PROPS'
storeFile=upload-keystore.jks
storePassword=<password>
keyAlias=<alias>
keyPassword=<password>
PROPS

# 4. Check, then release
flutter analyze && flutter test
shorebird release android --flavor prod --flutter-version=3.44.1 \
  --artifact apk -- --no-tree-shake-icons          # --flavor dev for dev

# 5. Publish the APK to this repo's release (same tag/asset name the page expects)
APK=$(find build -name '*.apk' -path '*release*' | head -n 1)
TAG=student-app-prod                               # <app>-app-<flavor>
cp "$APK" "$TAG.apk"
SHA=$(git rev-parse HEAD)
if gh release view "$TAG" --repo edunex1511-dot/edunex-stores >/dev/null 2>&1; then
  gh release upload "$TAG" "$TAG.apk" --repo edunex1511-dot/edunex-stores --clobber
  gh release edit   "$TAG" --repo edunex1511-dot/edunex-stores \
    --title "student app (prod) - Shorebird release <version>" \
    --notes "Built from edunex-flutter@$SHA"
else
  gh release create "$TAG" "$TAG.apk" --repo edunex1511-dot/edunex-stores \
    --title "student app (prod) - Shorebird release <version>" \
    --notes "Built from edunex-flutter@$SHA"
fi
```

Rules for by hand:

- **Never commit** `key.properties`, `upload-keystore.jks` or any `.env*` file.
  They are git-ignored on purpose; delete them when done on a shared computer.
- Keep `-- --no-tree-shake-icons` on the release, and use it on every later
  patch too (see C). Without it, patches that add or change icons fail.
- The asset name must be exactly `<app>-app-<flavor>.apk` and the tag
  `<app>-app-<flavor>`, or the download pages will not find it.
- Release with both `dev` and `prod` flavors separately; they are different
  Shorebird apps.

---

## C. Ship an app patch (over-the-air Dart fix)

Only for Dart-only changes, and only for a Shorebird release that already
exists. A patch reaches installs of that **exact release version and flavor**.

### Where it goes

- **dev flavor:** goes to the `beta` track. Testers on the **dev** app get it
  first. Verify, then run **Shorebird Promote** to make it `stable`.
- **prod flavor:** goes **straight to `stable`**, because no prod build ever
  follows `beta`. It is live for every user on their next launch the moment the
  run ends. So always test the same fix on the dev app first.

### Route 1: click

1. Get the right code: the live release's code plus your fix, nothing else.
   Branch from the release tag (or from `main` if `main` is exactly the
   release), apply only the fix, and push the branch.
2. **Actions**, **Shorebird Patch**, **Run workflow**, from that branch.
   - **app** and **flavor** as needed.
   - **release_version:** the release's pubspec version, exactly (for example
     `1.1.0+103`). For `app=both` it is the **student** release, and
     **teacher_release_version** is also required.
3. Wait about 25 minutes. The workflow rebuilds with the target release's own
   Flutter version and `--no-tree-shake-icons` and uploads the diff.
4. Check: `shorebird patches list --flavor <f> --release-version <v>` shows the
   patch number and its track.
5. Testers (dev app, tester options on, Beta chosen) open the app, wait about 15
   seconds and tap **Update**. Verify the fix.
6. **Dev only:** **Shorebird Promote** with app, flavor, `release_version` and
   `patch_number` (with `both`, also the teacher release and patch number; they
   differ per app).

**Two-launch rule:** a patch is downloaded on the launch where it is found and
applied on the next one. Fully close the app and reopen it.

### Route 2: by hand

Inside `apps/<app>`, logged in to Shorebird as `edunex1511@gmail.com`, with the
**same env files and keystore setup as the release** (assets must match
byte for byte, so use the same `.env.dev` / `.env.prod` URLs):

```bash
git checkout -b hotfix/<name> <release-tag>      # release code
# apply ONLY the Dart fix, then:
git diff <release-tag>                            # must show only the fix
flutter analyze && flutter test

# dev flavor: beta first
shorebird patch android --flavor dev  --release-version=1.1.0+103 --track=beta   -- --no-tree-shake-icons
# prod flavor: stable directly (live immediately)
shorebird patch android --flavor prod --release-version=1.1.0+103 --track=stable -- --no-tree-shake-icons

shorebird patches list    --flavor dev --release-version 1.1.0+103
shorebird patches promote --flavor dev --release-version 1.1.0+103 --patch-number <n>
shorebird patches rollback --flavor prod --release-version 1.1.0+103 --patch-number <n>
```

Rules for by hand:

- Do **not** pass `--flutter-version` to `patch`; it automatically uses the
  release's Flutter version. Check the line `Building patch with Flutter
  X.Y.Z` matches the release.
- Do not run `flutter pub upgrade` on a patch branch; dependencies must equal
  the release.
- If the CLI warns about **native or asset differences**, stop: the change needs
  a release. Do not answer yes to push it through.
- Rolling back: run `patches rollback`, then run `patches info` again a few
  minutes later. In one test a rollback later showed "Rolled back: no", cause
  unknown, so do not rely on it alone during an incident; ship a corrected patch.

---

## D. What to run when (cheat sheet)

| Situation | Do this |
| --- | --- |
| Typo, logic bug, screen fix (Dart only) | Fix on `dev`, test on the dev app, patch dev (`beta`), promote, then patch prod |
| New package, permission, asset, Flutter upgrade | Bump `+build`, **Shorebird Release** dev, test, then prod |
| Fix for an old release while `main` moved on | Branch from the release tag, cherry-pick only the fix, patch that release version |
| Teacher web only | **Deploy Teacher Web** (dev, then prod) |
| Force users off an old build | Raise `min_build` in Remote Config after a release |
| Something went wrong with a prod patch | `patches rollback`, then patch a fix |

Suggested order for a normal release day: server first, then web (dev, check,
prod), then app release (dev, check on a phone, prod), then Remote Config.

## E. Force or suggest an update (Firebase Remote Config)

Firebase console, Remote Config. One parameter per app: `student_update_policy`
and `teacher_update_policy` (dev project `edunex-dev-9d0fd`, prod project
`edunex-71189`). If the parameter does not exist, nobody is blocked.

```json
{"min_build": 100, "latest_build": 104, "store_url": "https://...", "message_en": "...", "message_ar": "..."}
```

- Builds below `min_build` see a blocking "Update required" screen; builds
  below `latest_build` are only offered an update. Both compare the `+build`
  number. Patches never change it.
- After each release set `latest_build`. Raise `min_build` only when older
  builds must stop working.
- `store_url` should be the APK link on this repo's releases, for example
  `https://github.com/edunex1511-dot/edunex-stores/releases/download/student-app-prod/student-app-prod.apk`.
- `min_build` and `latest_build` are plain numbers, and `store_url` must not be
  empty, or the whole policy is ignored (it fails open on purpose).
- Never leave a test value in the prod project.

## F. When a run fails

| What you see | Cause and fix |
| --- | --- |
| "Missing SHOREBIRD_TOKEN secret" | Add the API key as a repository secret in edunex-flutter. |
| "Insufficient permissions" at the Shorebird step | The key belongs to another Shorebird account. Create a new key as `edunex1511@gmail.com`. |
| "No space left on device" | Run from a branch that has the free-disk-space step. |
| Patch stops on asset or native differences | Not patchable. Ship a release instead. |
| Release refuses because the version exists | Raise the `+build` number in `pubspec.yaml` and run again. |
| Patch never reaches a phone | Same flavor and exact release version? Dev build with tester mode on and Beta chosen? Wait 15 seconds, then fully close and reopen the app. Prod builds only get `stable`. |
| Run sits "queued" for 15 minutes and is cancelled | GitHub never gave the job a runner (seen on this repo's Pages builds). Cancel, re-run, or use Route 2. A new push also cancels a running build. |
| Web deploy says "No changes to deploy" | The build output equals what is live. |
| Web deploy fails at `teachers.edunex` push | Check `TEACHERS_WEB_DEPLOY_TOKEN` and that the commit email is the noreply address. |
| Stuck on "Set up workspace" a few minutes | Normal on a cold cache (6 to 8 minutes). |
| A local `shorebird` command hangs | The CLI is updating its own Flutter. Wait; a second command makes them wait on each other. |

## G. Known gaps in the existing docs

Found while reviewing; not fixed here because they live in edunex-flutter.

- `docs/important_commands.md` shows the by-hand **prod** patch with
  `--track=beta`, but the workflow sends prod patches straight to `stable`.
  A prod patch on `beta` reaches nobody (prod builds do not follow beta) until
  promoted. Use the commands in section C.
- The live-releases table in `docs/RELEASE_WORKFLOW.md` lists `1.1.0+102` as the
  newest, while both app pubspecs on `main` say `1.1.0+103`. Either `+103` is
  not released yet or the table is stale; check `shorebird releases list` and
  update the table on every release.
- The web deploy by hand (section A, Route 2) is derived from the workflow;
  edunex-flutter has no written hand-run steps for it. The `teachers.edunex`
  repo's own settings (Vercel project, `vercel.json`) were not reviewed.
- iOS releases and patches are not covered: they wait for the Apple developer
  account.
