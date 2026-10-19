# object_viewer Project Instructions

## Version bumps, changelog, and how-to

Whenever you make a change to the app (anything under `object_viewer/`,
e.g. `index.html`, `styles.css`, `src/*.js`):

1. Bump the version badge in `object_viewer/index.html`
   (`<span id="appVersion" class="pill version-badge">`) — increment it
   (e.g. `v1` -> `v1.1` -> `v1.2`).
2. Add a new dated entry to `object_viewer/CHANGELOG.md` (newest first,
   Keep a Changelog style) describing the actual change. Do NOT add a
   separate line/entry just for the version bump itself (e.g. no
   "Bumped version badge to vX.X" entry) — the bump is implicit in
   each dated entry, not something to log on its own.
3. If the change affects how a user interacts with the app (new feature,
   changed behavior, new input format, etc.), update
   `object_viewer/HOWTO.md` to document it. Skip this step only for
   purely internal/cosmetic changes (e.g. a version bump alone) that
   don't change how the app is used.

Do this for every change, including small fixes — not just new features.

## Test plan maintenance

Once the user accepts/confirms the final result of a change (a feature,
fix, or behavior change they've tested and approved), add a new test
case to `object_viewer/TEST_PLAN.md` for it, or update an existing case
if the change modifies behavior an existing case already covers. Follow
the existing format: imperative, reproducible steps, grouped under the
relevant feature section, with a "Touches" line listing the files
involved.

## GitHub contributors

When pushing this repo to GitHub, ask who should be added/listed
as a contributor.

## Check open issues on load

Whenever this repo is loaded/opened for work, check for open GitHub issues
(e.g. `gh issue list --repo eLGorditoMIA/my_utils_public28456120476hjfahju3`)
and surface any that are open before starting other work.
