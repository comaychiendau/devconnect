# DevConnect review and next milestones

Reviewed: 12 September 2026

Work through one milestone at a time. A milestone is complete only when its check passes. Keep each code milestone to one function or one small configuration change.

## Tested baseline

| Check | Result |
|---|---|
| `dotnet test DevConnect.slnx --no-restore` | Passed, but no test project or tests were discovered. |
| `dotnet build DevConnect.slnx --no-restore` | Passed with 0 warnings and 0 errors. |
| `npm.cmd run lint` | Passed. |
| `npm.cmd run build` | Passed. |
| Public API request | `GET /weatherforecast` returned `200`. |
| Protected API request | Logged-out `GET /api/auth/me` returned `401`. |
| Authentication flow | Register `200`; authenticated `/me` `200`; duplicate register `400`; logout `200`; logged-out `/me` `401`; wrong password `401`; correct login `200`; `/me` `200`; final logout `200`. |
| Test data cleanup | The temporary user was deleted (`DELETE 1`). |

The normal HTTPS launch profile starts successfully. The automated request flow used temporary loopback HTTP because the restricted test shell could not use the Windows TLS credentials. Browser routing, form messages, refresh persistence, and the Vite proxy still need a browser check.

## Review findings

1. `backend/DevConnect.Api/appsettings.json` contains a tracked database password. User Secrets currently override it, and the tracked value failed local authentication, but it must still be removed and rotated anywhere it was reused.
2. `sendAuthRequest()` throws response objects. `LoginPage` and `SignUpPage` only display messages from `Error` instances, so useful API errors become generic messages.
3. `SignUpPage.handleSubmit()` disagrees with `RegisterRequest`: the API allows dots and hyphens in usernames and limits them to 30 characters; the page rejects those characters and has no maximum. The page also adds a two-character full-name rule that the API does not have.
4. `App()` protects `/communities`, although the product design describes a public community directory. Guests following “Browse directory” are redirected to login.
5. `CommunitiesPage.handleTabChange()` and the join button always open a sign-in prompt. An authenticated visitor is therefore told to sign in again.
6. `DevConnect.Api.http` still contains only the template weather request, and it targets HTTP even though authentication cookies are configured as secure.
7. `auth_dev.md` and `implementation_status.md` describe the implementation as pending and still refer to SQLite, `/signup`, and old file paths.
8. The template weather endpoint is dead scaffolding once the auth smoke requests replace it.
9. `CommunitiesPage` always supplies `status="empty"`, and the repository has no real `CommunityCard`; the page cannot display API results yet.

## Milestones

### M0 — Establish the baseline ✅

Run the checks and live API flow listed above.

Done: 12 September 2026.

### M1 — Remove the tracked database password -- DONE!!!

- [ ] Delete `ConnectionStrings` from `appsettings.json`; keep the local value in .NET User Secrets.
- [ ] Rotate the exposed value anywhere it was reused.

Check: the API starts from User Secrets, and no tracked settings file contains `Password=`.

### M2 — Make the auth smoke flow repeatable

- [ ] Replace the weather request in `DevConnect.Api.http` with register, duplicate register, login, `/me`, logout, and logged-out `/me` requests using `https://localhost:7201`.

Check: the requests return `200, 400, 200, 200, 200, 401` in that order. Use a fresh email for each run.

### M3 — Fix `sendAuthRequest()`

- [ ] Throw an `Error` whose message comes from `data.message`, Identity's `errors` array, or ASP.NET validation's `errors` object.

Check: wrong login shows “Invalid email or password”, and duplicate registration shows the server's duplicate-field messages. Keep this normalization inside the existing function; no new API layer is needed.

### M4 — Align `SignUpPage.handleSubmit()`

- [ ] Allow letters, numbers, dots, underscores, and hyphens; reject usernames over 30 characters; remove the frontend-only two-character name rule.

Check: `dev.user-name` passes client validation, a 31-character username fails before submission, and the API accepts the same values as the page.

### M5 — Make `App()` expose the public directory

- [ ] Render `CommunitiesPage` directly at `/communities`.
- [ ] Delete `ProtectedRoute.jsx` if no route uses it after this change.

Check: a logged-out visitor can open `/communities`; refreshing the route does not redirect to `/login`.

### M6 — Fix `CommunitiesPage.handleTabChange()`

- [ ] Read the current user from `useAuth()`. Select `joined` for a signed-in user and open `AuthenticationPrompt` only for a guest.

Check: guests are prompted from Joined; signed-in users see the Joined empty state without a sign-in prompt.

### M7 — Fix the community join button

- [ ] Prompt a guest to authenticate. For a signed-in user, disable the action with honest “Joining coming next” text until the join endpoint exists.

Check: a signed-in user is never shown “Sign in required”.

### M8 — Verify `AuthProvider()` in the browser

- [ ] Test signup, wrong login, correct login, refresh, Remember me, logout, and direct navigation to `/communities` as both guest and member.

Check: record the pass/fail result here. Only change `AuthProvider()` if this check finds a defect.

### M9 — Reconcile the auth documentation

- [ ] Update `auth_dev.md` to PostgreSQL, `/register`, and the actual file paths; mark completed items.
- [ ] Update `implementation_status.md` with the browser-test result and link to this milestone list.

Check: neither document lists implemented frontend authentication as pending.

### M10 — Remove the weather template

- [ ] Delete `WeatherForecastController.cs` and `WeatherForecast.cs` after M2 replaces their only smoke request.

Check: backend build still passes and `/weatherforecast` returns `404`.

## First feature after stabilization: public communities

Do not build joining, posts, administration, or recommendations yet. The first useful slice is a read-only directory.

### M11 — Define `Community`

- [ ] Add only id, name, and description, register the entity with `ApplicationDbContext`, and add the EF migration.

Check: the migration applies to an empty development database.

### M12 — Add `CommunitiesController.Get()`

- [ ] Return id, name, and description from `GET /api/communities` with no write operations.

Check: an anonymous request returns `200` and an empty JSON array when the database has no communities.

### M13 — Add frontend `getCommunities()`

- [ ] Fetch `/api/communities` with the existing request style and surface non-success responses as `Error` instances.

Check: the function handles success and failure without adding a new HTTP dependency.

### M14 — Add `CommunityCard()`

- [ ] Render the API's name and description using the existing card styles. Leave member count, tags, and activity out until their data exists.

Check: one supplied community renders without hard-coded community data.

### M15 — Load data in `CommunitiesPage`

- [ ] Replace the fixed `status="empty"` with loading, success, empty, and error state derived from `getCommunities()`, rendering `CommunityCard` on success.

Check: the existing skeleton, empty state, and error state each render from a real request outcome.
