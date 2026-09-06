# auth_dev

Goal: complete basic email/password authentication before moving to the next feature.

Use ASP.NET Core Identity with SQLite. Identity already handles user IDs, usernames, emails, password hashing, and secure cookie authentication.

## 1. User database and model

- [ ] Create `backend/DevConnect.Api/Models/ApplicationUser.cs`
  - Inherit from Identity's user model.
  - Add only `FullName`; the other common user fields are already provided.
- [ ] Create `backend/DevConnect.Api/Data/ApplicationDbContext.cs`
  - Connect Identity's user tables to the database.
- [ ] Modify `backend/DevConnect.Api/DevConnect.Api.csproj`
  - Add Identity, Entity Framework Core, SQLite, and EF migration packages.
- [ ] Modify `backend/DevConnect.Api/appsettings.Development.json`
  - Add the development database connection string.
- [ ] Modify `backend/DevConnect.Api/Program.cs`
  - Register the database, Identity, cookie authentication, and authorization.
- [ ] Generate the first Entity Framework migration.
  - EF will create `backend/DevConnect.Api/Migrations/`; do not create migration files manually.

## 2. Sign-up backend endpoint

- [ ] Create `backend/DevConnect.Api/Contracts/AuthContracts.cs`
  - Store the registration request and safe user response types.
- [ ] Create `backend/DevConnect.Api/Controllers/AuthController.cs`
  - Add `POST /api/auth/signup`.
  - Use Identity's `UserManager`; do not hash passwords or set `PasswordHash` yourself.

## 3. Test the sign-up endpoint

- [ ] Modify `backend/DevConnect.Api/DevConnect.Api.http`
  - Test successful registration.
  - Test invalid information.
  - Test duplicate email.
  - Test duplicate username.

No new testing folder is required yet.

## 4. Connect the sign-up page

- [ ] Create `frontend/src/api/auth.js`
  - Keep frontend authentication requests together here.
- [ ] Modify `frontend/src/pages/SignUpPage.jsx`
  - Call the sign-up API.
  - Show server errors.
  - Handle the loading state.
  - Redirect after successful registration.
- [ ] Modify `frontend/vite.config.js`
  - Add a development proxy from `/api` to the ASP.NET backend.

Keep the existing frontend validation and include cookies in authentication requests.

## 5. Login backend endpoint

- [ ] Modify `backend/DevConnect.Api/Contracts/AuthContracts.cs`
  - Add the login request type.
- [ ] Modify `backend/DevConnect.Api/Controllers/AuthController.cs`
  - Add `POST /api/auth/login`.
  - Use Identity's `SignInManager`.
  - Return one general invalid-credentials error rather than revealing whether an email exists.

## 6. Connect the login page

- [ ] Modify `frontend/src/api/auth.js`
  - Add the login request.
- [ ] Modify `frontend/src/pages/LoginPage.jsx`
  - Submit the login form.
  - Show server errors.
  - Handle the loading state.
  - Redirect after successful login.

No new files are required for this point.

## 7. Current-user and logout endpoints

- [ ] Modify `backend/DevConnect.Api/Controllers/AuthController.cs`
  - Add `GET /api/auth/me`.
  - Add `POST /api/auth/logout`.
- [ ] Modify `frontend/src/api/auth.js`
  - Add `getCurrentUser` and `logout` functions.

`/me` should return only safe user information. Logout should be a `POST`, not a `GET`.

## 8. Protect pages and test the complete flow

- [ ] Create `frontend/src/auth/AuthContext.jsx`
  - Store the current user.
  - Check `/api/auth/me` when the application loads.
  - Provide authentication and logout state to the application.
- [ ] Modify `frontend/src/main.jsx`
  - Wrap the application with the authentication provider.
- [ ] Modify `frontend/src/App.jsx`
  - Protect routes such as `/communities`.
  - Keep a small route guard in this file initially.
- [ ] Modify `frontend/src/components/AppHeader.jsx`
  - Show the current user and provide a logout button where appropriate.
- [ ] Modify `backend/DevConnect.Api/DevConnect.Api.http`
  - Add login, `/me`, and logout requests.
- [ ] Manually test:
  - Correct and incorrect login.
  - Refreshing while logged in.
  - Logging out.
  - Opening a protected page while logged out.

## Not needed yet

Do not add repository, service, interface, or JWT-helper folders. ASP.NET Core Identity already covers those responsibilities. Add more layers only when the code has a real need for them.
