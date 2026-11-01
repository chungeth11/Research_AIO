import { useState } from "react";

function Auth({ onSignIn, onSignUp, onGoogleSignIn, authMode, authError }) {
  const [mode, setMode] = useState("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(authError ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignUp = mode === "signUp";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await (isSignUp
        ? onSignUp({ email, password })
        : onSignIn({ email, password }));
      if (result.error) {
        setError(result.error.message);
      } else if (isSignUp && !result.session) {
        setMessage("Account created. Check your email to confirm it, then sign in.");
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const result = await onGoogleSignIn();
      if (result.error) setError(result.error.message);
    } catch (signInError) {
      setError(signInError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
        <div className="mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
            R
          </div>
          <p className="mt-6 text-sm font-semibold text-blue-600">ResearchAIO</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isSignUp
              ? "Sign up to access your research workspace."
              : "Sign in to continue to your research workspace."}
          </p>
        </div>

        {authMode === "demo" && (
          <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-900">
            Demo authentication is active. Credentials are not verified; do not
            use a real password. Configure Supabase to enable secure accounts.
          </p>
        )}
        {authMode === "supabase" && (
          <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-5 text-emerald-900">
            Supabase authentication is configured for this app.
          </p>
        )}
        {authMode === "setup" && !error && (
          <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-5 text-rose-800">
            Supabase configuration is incomplete. Set both required Vite
            environment variables to continue.
          </p>
        )}

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClassName}
              placeholder="At least 8 characters"
            />
          </label>
          {isSignUp && (
            <label className="block text-sm font-medium text-slate-700">
              Confirm password
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={inputClassName}
                placeholder="Re-enter your password"
              />
            </label>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting
              ? "Please wait..."
              : isSignUp
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase text-slate-400">or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isSignUp ? "Already have an account?" : "New to ResearchAIO?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isSignUp ? "signIn" : "signUp");
              setError("");
              setMessage("");
            }}
            className="font-semibold text-blue-700 hover:text-blue-900"
          >
            {isSignUp ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}

export default Auth;
