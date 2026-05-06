# Authentication App

A clean authentication-based frontend built with React, Vite, CSS, and the FreeAPI Authentication Module. The app demonstrates a complete user auth flow with register, login, current-user profile, logout, loading states, success messages, and error handling.

## Live Links

- Demo: `https://github.com/asifansari84/authentication-application`
- Repository: `https://authentication-application-psi.vercel.app/`

## Use Case

This project is useful for understanding how frontend authentication works with API requests and session-based login. A user can create an account, log in with their credentials, view their authenticated profile, refresh current-user details, and log out to clear the session.

The app separates the user experience into two clear states:

- Guest state: shows only Login and Register pages.
- Authenticated state: shows a dedicated Profile Dashboard page.

## Features

- Register new users with email, username, password, and role.
- Login existing users with username and password.
- Show authenticated current-user profile details.
- Logout and clear the active session.
- Separate auth pages and dashboard page.
- Success and error messages for user feedback.
- Loading states during API requests.
- Responsive UI with light and dark mode support.
- Vite proxy setup to avoid browser CORS issues with credentialed API requests.

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- FreeAPI Authentication Module

## API Endpoints

Base API:

```text
https://api.freeapi.app/api/v1/users
```

The frontend calls these routes through the local Vite proxy:

```text
/api/v1/users/register
/api/v1/users/login
/api/v1/users/logout
/api/v1/users/current-user
```

## File Structure

```text
authentication-app/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## How To Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://127.0.0.1:5173/
```

If that port is already in use, Vite will start on another port such as `5174`.

## Available Scripts

```bash
npm run dev
```

Runs the app in development mode.

```bash
npm run build
```

Creates a production build.

```bash
npm run lint
```

Runs ESLint checks.

```bash
npm run preview
```

Previews the production build locally.

## Important Note About API Requests

The FreeAPI server uses cookies/sessions for authentication. Direct browser requests with credentials can run into CORS restrictions, so this project uses a Vite dev proxy in `vite.config.js`.

Frontend code calls:

```text
/api/v1/users/...
```

Vite forwards those requests to:

```text
https://api.freeapi.app
```

## More Work Needed

- Deploy the project and add the live demo link.
- Add the GitHub repository link after pushing the code.
- Add form validation messages for stronger password and username rules.
- Add route-based pages with React Router.
- Add protected route handling for dashboard access.
- Add toast notifications for a more polished feedback system.
- Add a loading screen while checking the current session on first page load.
- Add screenshots or a short demo GIF to the README.

## Learning Outcome

This project helps practice frontend authentication concepts such as request bodies, API calls, cookies, sessions, logged-in user state, protected UI, loading states, and error handling.

## Author

Built as part of a frontend authentication project using FreeAPI.

Thanks for checking out the project. Keep building, keep shipping, and make the next version a little sharper than this one.
