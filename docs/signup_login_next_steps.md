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

## M21 — Add community ownership and moderated membership applications

Change community joining from immediate membership into an application-and-approval workflow.

A user who clicks **Join** must review the community rules, answer the creator/admin’s questions, and submit an application. The user becomes a member only after an authorised community creator or admin approves the application.

### M21A — Add community governance

* [ ] Associate every community with a creator/owner.
* [ ] Support community-specific roles:

  * Creator
  * Admin
  * Member
* [ ] Keep community roles separate from global application roles.
* [ ] Allow only the creator and community admins to manage admission settings.
* [ ] Allow only the creator and community admins to review applications.
* [ ] Define a safe migration strategy for existing communities that do not yet have an owner.
* [ ] Preserve all existing community memberships during the migration.
* [ ] Enforce permissions in the backend rather than relying only on hidden frontend controls.

**Check:** an ordinary member cannot modify community admission settings or review another user’s application.

---

### M21B — Add rules, questions, applications, and answers

Add persistent entities for:

* [ ] Community rules.
* [ ] Community join questions.
* [ ] Join applications.
* [ ] Application answers.
* [ ] Application status.
* [ ] Submission and review metadata.

Each community rule should support:

* [ ] Rule text.
* [ ] Display order.
* [ ] Active/inactive state.

Each join question should support:

* [ ] Question text.
* [ ] Display order.
* [ ] Required/optional state.
* [ ] Active/inactive state.

Each application should store:

* [ ] Community ID.
* [ ] Applicant user ID.
* [ ] Status:

  * `Pending`
  * `Approved`
  * `Rejected`
* [ ] Submission timestamp.
* [ ] Review timestamp when reviewed.
* [ ] Reviewing creator/admin ID when reviewed.
* [ ] The answers submitted by the applicant.
* [ ] A snapshot of each question’s wording so historical applications remain understandable after questions are edited.

Add database constraints that prevent:

* [ ] A current member from submitting an application.
* [ ] More than one pending application for the same user and community.
* [ ] Applications for communities that do not exist.
* [ ] Answers that do not belong to the submitted application.
* [ ] Approval by an unauthorised user.

Define whether a rejected applicant may submit another application later. Do not leave this behaviour accidental.

**Check:** pending and rejected applicants are not stored as active community members.

---

### M21C — Add the membership-application API

Add authenticated endpoints for applicants to:

* [ ] Load the active rules and questions for a community.
* [ ] Load their current application status.
* [ ] Submit an application and its answers.
* [ ] Receive validation errors for missing required answers.
* [ ] Receive a conflict response when already a member or already pending.

Suggested routes:

```text
GET  /api/communities/{communityId}/join-form
GET  /api/communities/{communityId}/applications/me
POST /api/communities/{communityId}/applications
```

The submission endpoint must:

* [ ] Validate the community.
* [ ] Validate the authenticated user.
* [ ] Reject existing members.
* [ ] Reject duplicate pending applications.
* [ ] Validate every required question.
* [ ] Save the application and answers in one transaction.
* [ ] Return the saved `Pending` application state.

The existing direct-join endpoint must not remain as a way for ordinary users to bypass approval.

**Check:** submitting a valid application returns `Pending` but does not create a community membership.

---

## M22 — Build the member join-application interface

Replace the current immediate Join behaviour with an application dialog or panel.

### Application flow

```text
Join
  → View community rules
  → Answer required questions
  → Review answers
  → Confirm submission
  → Application pending
```

* [ ] Keep the existing authentication prompt for guests.
* [ ] Open the application interface when an authenticated non-member clicks **Join**.
* [ ] Load rules and questions from the API.
* [ ] Display rules before the confirmation action.
* [ ] Render questions in their configured order.
* [ ] Clearly identify required questions.
* [ ] Validate required answers before submission.
* [ ] Allow the user to cancel without submitting.
* [ ] Require an explicit confirmation before submission.
* [ ] Disable repeated submission while the request is running.
* [ ] Show a recoverable API error without losing the user’s answers.
* [ ] Update the UI only after the server confirms the submission.
* [ ] Restore the saved application state after refresh.

Replace the current boolean-only membership display with a state-aware result:

| State           | Primary interface                       |
| --------------- | --------------------------------------- |
| Guest           | Join, followed by authentication prompt |
| Not applied     | Join                                    |
| Submitting      | Submitting...                           |
| Pending         | Application pending                     |
| Approved member | Leave                                   |
| Rejected        | Application declined                    |

Update the shared community membership/application hook so the directory and detail page use the same server-derived state.

**Check:** submitting from either the directory or detail page produces the same pending state, and refreshing does not return the button to Join.

---

## M23 — Add creator/admin admission management

### Admission configuration

Allow an authorised community creator or admin to:

* [ ] View the community’s current rules.
* [ ] Add, edit, reorder, activate, or deactivate rules.
* [ ] View the community’s join questions.
* [ ] Add, edit, reorder, activate, or deactivate questions.
* [ ] Mark questions as required or optional.
* [ ] Save configuration changes with clear success and error states.

Do not permanently delete question information needed by previously submitted applications.

### Application review queue

Add an authorised management page where the creator/admin can:

* [ ] View pending applications.
* [ ] Open an individual application.
* [ ] See the applicant’s identity.
* [ ] See the submission timestamp.
* [ ] Read the rules and question snapshots presented to the applicant.
* [ ] Read every submitted answer.
* [ ] Approve the application.
* [ ] Reject the application.
* [ ] Confirm consequential review actions.
* [ ] See clear empty, loading, error, and retry states.

Suggested routes:

```text
GET  /api/communities/{communityId}/applications?status=Pending
GET  /api/communities/{communityId}/applications/{applicationId}
POST /api/communities/{communityId}/applications/{applicationId}/approve
POST /api/communities/{communityId}/applications/{applicationId}/reject
```

Approving an application must perform one transaction that:

1. Confirms the application is still pending.
2. Confirms the reviewer is an authorised creator/admin.
3. Creates the community membership.
4. Changes the application status to `Approved`.
5. Records the reviewer and review timestamp.

Rejecting must:

1. Confirm the application is still pending.
2. Confirm the reviewer is authorised.
3. Change the application status to `Rejected`.
4. Record the reviewer and review timestamp.
5. Avoid creating a community membership.

**Check:** only an approved applicant appears in the Joined tab and receives member permissions.

---

## M24 — Integrate and harden the moderated membership workflow

* [ ] Preserve existing approved memberships.
* [ ] Keep pending and rejected applications out of the Joined tab.
* [ ] Ensure the directory and detail page display the same state.
* [ ] Ensure approved members can still leave.
* [ ] Prevent members from applying again.
* [ ] Prevent duplicate pending applications.
* [ ] Prevent an application from being approved or rejected twice.
* [ ] Handle concurrent review attempts safely.
* [ ] Preserve historical applications after rules or questions are changed.
* [ ] Confirm that unauthorised users receive `403 Forbidden`.
* [ ] Confirm that unauthenticated users receive `401 Unauthorized`.
* [ ] Confirm that missing communities or applications return `404 Not Found`.
* [ ] Add backend tests for submission, validation, approval, rejection, permissions, and duplicate prevention.
* [ ] Add frontend tests for the dialog, validation, submission, pending state, approval state, and recoverable errors.
* [ ] Run the complete guest, applicant, member, creator, and admin flows.
* [ ] Confirm PostgreSQL remains the source of truth after refresh.

**Check:** the complete workflow is deterministic:

```text
Not applied
  → Pending
  → Approved member
```

or:

```text
Not applied
  → Pending
  → Rejected
```

No frontend action may create membership without successful server approval.

---

## M25 — Add real discovery metadata only when required

This is the former M21. Keep it deferred until the product has enough real data and user demand to justify each option.

* [ ] Add community timestamps before restoring Newest sorting.
* [ ] Add approved membership counts before restoring Members sorting.
* [ ] Exclude pending and rejected applications from membership counts.
* [ ] Define a meaningful activity signal before restoring Activity sorting or Trending.
* [ ] Move search and sorting to the backend when loading and filtering the complete directory becomes measurably unsuitable.
* [ ] Add pagination when directory size or measured performance requires it.
* [ ] Keep deterministic tie-breaking for every backend sort.

Do not add speculative sorting options whose values are not stored by the backend.

**Check:** every restored discovery option maps to a stored value, considers only the correct records, and produces a deterministic API result.

## Intentionally deferred

Posts, comments, community administration, invitations, private communities, roles, recommendations, and notifications are outside the next slice. Add them after membership and community detail work are complete.
