# React + Vite

## Authentication and Supabase OAuth

The app includes a local demo sign-in when Supabase environment variables are
not set. Demo credentials are not verified and must not be used as real account
security. Passwords are never stored by the demo adapter.

To enable Supabase email/password authentication and Google OAuth:

1. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` from your Supabase project's API settings. These
   are public client values; never put a service-role key in the frontend.
2. In Supabase, enable Email under Authentication providers. To enable Google,
   enable the Google provider and provide its OAuth client ID and secret.
3. Add `http://localhost:5173` and your deployed app URL to the Supabase
   Authentication URL configuration. Set the Google OAuth callback URL to
   `https://<project-ref>.supabase.co/auth/v1/callback`.
4. Restart the Vite server after changing environment variables.

All auth operations are routed through `src/auth/authClient.js`, keeping the
UI independent of the selected auth provider.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
