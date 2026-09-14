# DevConnect review and next milestones

Reviewed: 14 September 2026

Work through one milestone at a time. A milestone is complete only when its check passes.

## Verified baseline

| Check | Result |
| --- | --- |
| `npm.cmd run lint` | Passed on 14 September 2026. |
| `npm.cmd run build` | Passed on 14 September 2026. |
| Isolated backend build | Passed with 0 warnings and 0 errors on 14 September 2026. |
| Normal backend build | Could not replace the output DLL because the API was already running; this was a file lock, not a compile error. |
| Automated tests | No backend or frontend test project exists yet. |

## Current communities flow

The public read-only directory is connected end to end:

1. `App.jsx` maps `/communities` directly to `CommunitiesPage`, so guests may open it.
2. `CommunitiesPage` calls `getCommunities()` when it mounts and when Retry increments `requestVersion`.
3. `frontend/src/api/communities.js` sends `GET /api/communities` and rejects failed or non-array responses.
4. Vite proxies `/api` to the ASP.NET backend during development.
5. `CommunitiesController.Get()` reads `ApplicationDbContext.Communities` without tracking, orders by name, projects only `id`, `name`, and `description`, and returns JSON.
6. `CommunitiesPage` turns the response into loading, success, empty, or error UI through `ResourceState`.
7. A successful non-empty response is rendered by `CommunityCard`.

Authentication currently affects controls, not public data:

- Discover is public.
- A guest selecting Joined receives `AuthenticationPrompt`.
- A signed-in user may select Joined, but it always shows an empty state because memberships do not exist yet.
- The signed-in Join button is deliberately disabled with `Joining coming next`.

Known limits in the current screen:

- Search text is stored but does not filter the returned array.
- Sort selection is stored but does not sort or refetch anything.
- Discover and Trending show the same array.
- No endpoint creates communities; do not add an anonymous write endpoint as a shortcut.
- No membership table or join/leave endpoint exists.
- `ProtectedRoute.jsx` is unused.
- `auth_dev.md` and `implementation_status.md` are stale.
- `App.css` contains duplicate `community-grid` rules.

## Completed milestones

| Milestone | Status | Evidence |
| --- | --- | --- |
| M0 - Establish baseline | Complete | Auth API flow and builds were previously exercised. |
| M1 - Remove tracked database password | Code complete | Tracked settings no longer contain a password. Rotation outside the repository still requires owner confirmation. |
| M2 - Repeatable auth smoke requests | Complete | `DevConnect.Api.http` contains HTTPS register, login, current-user, and logout requests. |
| M3 - Normalize auth API errors | Complete | `sendAuthRequest()` throws `Error` with backend messages. |
| M4 - Align signup validation | Complete | Frontend username and length rules match `RegisterRequest`. |
| M5 - Expose public directory | Behavior complete | `/communities` renders directly; unused `ProtectedRoute.jsx` remains as cleanup. |
| M6 - Auth-aware Joined tab | Complete | Guests are prompted; signed-in users may select it. |
| M7 - Auth-aware Join button | Complete | Guests are prompted and signed-in users see an honest disabled state. |
| M10 - Remove weather template | Complete | Weather source files no longer exist. |
| M11 - Define `Community` | Complete | Model, `DbSet`, and table migration exist. |
| M12 - Public communities endpoint | Complete | Anonymous `GET /api/communities` returns projected data. |
| M13 - Frontend communities client | Complete | `getCommunities()` handles success, HTTP errors, and invalid response shape. |
| M14 - Community card | Complete | The component renders API name and description only. |
| M15 - Load the directory | Complete | The page uses real loading, success, empty, retry, and error state. |

## Remaining housekeeping

These do not block the next community feature, but should not be forgotten:

- [ ] M8 - Complete the browser auth check: signup, wrong login, correct login, refresh, Remember me, logout, and direct guest/member navigation to `/communities`.
- [ ] M9 - Replace the stale auth plan/status text with links to `authentication_and_home_flow.md` and this tracker.
- [ ] Confirm that the previously tracked database credential was rotated anywhere it was reused.
- [ ] Delete `ProtectedRoute.jsx` while no route uses it.
- [ ] Remove the duplicate top-level community CSS rules and the `Add the new styles here` comment.

## Next community milestones

### M16 - Make the public directory controls honest

- [ ] Filter the already-loaded communities by name and description when `filters.query` changes.
- [ ] Show the filtered result count.
- [ ] Remove the inactive sort control and Trending tab until the API has fields that can support them.
- [ ] Keep the existing backend alphabetical order; do not add another request or dependency.

Check: typing part of a name or description narrows the cards, Clear search restores them, and every visible control changes the result.

### M17 - Add community membership storage

- [ ] Add one `CommunityMembership` entity containing `UserId` and `CommunityId`.
- [ ] Use a composite primary key or unique constraint so a user cannot join the same community twice.
- [ ] Add the EF Core relationships and one migration.
- [ ] Do not add roles, invitations, subscriptions, or notification settings yet.

Check: the migration applies, duplicate membership rows are rejected by the database, and deleting a user or community has an intentional relationship behavior.

### M18 - Add authenticated membership endpoints

- [ ] Add an authorized join endpoint for one community.
- [ ] Add an authorized leave endpoint for one community.
- [ ] Add an authorized endpoint that returns the current user's joined communities.
- [ ] Return `404` for an unknown community and make repeated join/leave requests predictable.
- [ ] Add the smallest automated backend checks for guest rejection, join, duplicate join, joined listing, and leave.

Check: a guest receives `401`; a signed-in user can join once, see the community in Joined, leave it, and no longer see it.

### M19 - Connect membership to the React directory

- [ ] Add join, leave, and joined-community functions beside `getCommunities()` in `frontend/src/api/communities.js`.
- [ ] Make the Joined tab load the authenticated user's real memberships.
- [ ] Give each `CommunityCard` a Join or Leave action based on membership state.
- [ ] Keep `AuthenticationPrompt` for guest join attempts.
- [ ] Update local state only after a successful server response and display a recoverable error on failure.

Check: join and leave update both the card action and Joined tab without a full page reload; refresh restores the server state.

### M20 - Add a read-only community detail page

- [ ] Add `GET /api/communities/{id}` returning only the fields that exist.
- [ ] Return `404` for an unknown ID.
- [ ] Add `/communities/:id` and make each card link to it.
- [ ] Reuse the membership action from M19 instead of implementing a second version.

Check: a guest can open a valid detail URL, an invalid ID shows a clear not-found state, and a signed-in user sees the same join state as the directory.

### M21 - Add real discovery metadata only when required

Do this only after real product data exists for the feature:

- [ ] Add timestamps before restoring Newest sorting.
- [ ] Add membership counts before restoring Members sorting.
- [ ] Define an activity signal before restoring Activity sorting or Trending.
- [ ] Move search/sort to the backend and add pagination when loading the whole directory becomes measurably unsuitable.

Check: every restored option maps to a stored value and produces a deterministic API result.

## Intentionally deferred

Posts, comments, community administration, invitations, private communities, roles, recommendations, and notifications are outside the next slice. Add them after membership and community detail work are complete.
