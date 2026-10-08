# Doc fixes to apply in edunex-flutter

Found while writing [SHIPPING_GUIDE.md](SHIPPING_GUIDE.md). Reviewed against
edunex-flutter `main` at commit `7eb7014` (2026-10-08). Nothing here has been
applied: the Flutter repo was read-only for that review. Apply these in a
clone of edunex-flutter, on a normal branch and PR.

Source of truth for patch tracks is `.github/workflows/shorebird-patch.yml`:
`TRACK: ${{ inputs.flavor == 'prod' && 'stable' || 'beta' }}`. So the **dev**
flavor goes to `beta`, and the **prod** flavor goes straight to `stable`.

## 1. `docs/important_commands.md`, line 44: wrong track statement

Current:

```
"Shorebird Release", "Shorebird Patch" (beta track only) and "Shorebird
```

Change `(beta track only)` to `(dev goes to beta, prod goes straight to stable)`.

Why: the workflow no longer sends everything to beta. The old wording suggests
a prod patch always needs a promote step, which it does not.

## 2. `docs/important_commands.md`, lines 53 to 55: prod patch sent to beta

Current:

```
## Patch (testers first: beta track)

shorebird patch android --flavor prod --release-version=1.0.0+100 --track=beta -- --no-tree-shake-icons
```

Replace with two commands:

```
## Patch (dev: beta first. prod: straight to stable, live at once)

shorebird patch android --flavor dev  --release-version=1.1.0+103 --track=beta   -- --no-tree-shake-icons
shorebird patch android --flavor prod --release-version=1.1.0+103 --track=stable -- --no-tree-shake-icons
```

Why: prod builds never follow `beta` (tester mode is dev-only). A prod patch
pushed to `beta` by hand reaches nobody until it is promoted, which is not what
the workflow does. Also update the example version to a real one.

Also add one line under it: "Test the same fix on the dev app first. A prod
patch is live for every user on their next launch."

## 3. `docs/RELEASE_WORKFLOW.md`, live-releases table (lines 118 to 123)

The newest entries are `1.1.0+102` (dev only) and `1.0.1+101` (prod), while both
app `pubspec.yaml` files on `main` say `1.1.0+103`. Either `+103` is not
released, or the table is stale. Check with `shorebird releases list --flavor
dev` and `--flavor prod` inside each app, then:

- Add a row for every live release that is missing.
- If `+103` is only on `main` and unreleased, say so in the table or skip it.
- Keep the table sorted so the newest release per app and flavor is easy to find.

Why: patches must target the exact released version. A wrong version in this
table means a patch run is aimed at a release that does not exist or is not the
live one.

## 4. Optional: written steps for the manual web deploy

`docs/HOW_TO_SHIP.md` says to use the **Deploy Teacher Web** workflow but has no
by-hand steps for when Actions is stuck. Section A (Route 2) of SHIPPING_GUIDE.md
has them, derived from `deploy-teacher-web.yml`. Link to it or copy it into
HOW_TO_SHIP.md, and have someone who deploys web confirm it against the
`teachers.edunex` repo and its Vercel settings, which were not reviewed.

## Prompt to give Claude in your local edunex-flutter clone

```
Apply the doc fixes in this file to this repo:
https://github.com/edunex1511-dot/edunex-stores/blob/main/docs/FLUTTER_REPO_DOC_FIXES.md

Rules:
- Read .github/workflows/shorebird-patch.yml first and confirm the track logic
  (dev -> beta, prod -> stable) yourself before editing anything.
- Fix items 1 and 2 in docs/important_commands.md.
- For item 3, run `shorebird releases list --flavor dev` and `--flavor prod` in
  apps/student_app and apps/teacher_app (login as edunex1511@gmail.com) and
  update the table in docs/RELEASE_WORKFLOW.md to match what is really live.
  If you cannot log in, leave the table alone and tell me what to check.
- Item 4 is optional: only do it if I say so.
- Docs only. Do not touch workflows, pubspecs or code. Follow the repo's
  CLAUDE.md conventions. Make a branch and a PR; do not merge it.
- Report what you changed and anything you could not verify.
```
