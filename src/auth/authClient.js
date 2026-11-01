import { createClient } from "@supabase/supabase-js";

const environment = import.meta.env ?? {};
const supabaseUrl = environment.VITE_SUPABASE_URL;
const supabaseAnonKey = environment.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const hasPartialSupabaseConfig = Boolean(supabaseUrl) !== Boolean(supabaseAnonKey);
let supabaseInitializationError = null;
let supabaseClient = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    supabaseInitializationError = error;
  }
}

function getSupabaseConfigurationError() {
  if (supabaseInitializationError) return supabaseInitializationError;
  if (!hasPartialSupabaseConfig) return null;
  return new Error(
    "Set both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to configure Supabase.",
  );
}

const demoSessionKey = "research-aio-demo-session";
const demoListeners = new Set();
let demoSession = null;

function getDemoSession() {
  if (demoSession) return demoSession;

  try {
    const storedSession = window.sessionStorage.getItem(demoSessionKey);
    demoSession = storedSession ? JSON.parse(storedSession) : null;
    return demoSession;
  } catch (error) {
    throw new Error(`Could not read the demo session: ${error.message}`, { cause: error });
  }
}

function saveDemoSession(session) {
  try {
    if (session) {
      window.sessionStorage.setItem(demoSessionKey, JSON.stringify(session));
    } else {
      window.sessionStorage.removeItem(demoSessionKey);
    }
    demoSession = session;
    demoListeners.forEach((listener) => listener(session));
  } catch (error) {
    throw new Error(`Could not save the demo session: ${error.message}`, { cause: error });
  }
}

const authClient = {
  get mode() {
    if (getSupabaseConfigurationError()) return "setup";
    return isSupabaseConfigured ? "supabase" : "demo";
  },

  async getSession() {
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) return { session: null, error: configurationError };
    if (!supabaseClient) {
      try {
        return { session: getDemoSession(), error: null };
      } catch (error) {
        return { session: null, error };
      }
    }

    const { data, error } = await supabaseClient.auth.getSession();
    return { session: data.session, error };
  },

  async signIn(credentials) {
    const { email, password } = credentials;
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) return { session: null, error: configurationError };
    if (!supabaseClient) {
      const session = {
        user: { id: `demo-${email.toLowerCase()}`, email },
        isDemo: true,
      };
      try {
        saveDemoSession(session);
        return { session, error: null };
      } catch (error) {
        return { session: null, error };
      }
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    return { session: data.session, error };
  },

  async signUp(credentials) {
    const { email, password } = credentials;
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) return { session: null, error: configurationError };
    if (!supabaseClient) {
      const session = {
        user: { id: `demo-${email.toLowerCase()}`, email },
        isDemo: true,
      };
      try {
        saveDemoSession(session);
        return { session, error: null };
      } catch (error) {
        return { session: null, error };
      }
    }

    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    return { session: data.session, error };
  },

  async signInWithGoogle() {
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) return { error: configurationError };
    if (!supabaseClient) {
      return {
        error: new Error(
          "Google sign-in requires Supabase. Configure the Supabase environment variables and enable Google in Supabase Auth.",
        ),
      };
    }

    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    return { error };
  },

  async signOut() {
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) return { error: configurationError };
    if (!supabaseClient) {
      try {
        saveDemoSession(null);
        return { error: null };
      } catch (error) {
        return { error };
      }
    }

    const { error } = await supabaseClient.auth.signOut();
    return { error };
  },

  subscribe(listener) {
    if (supabaseClient) {
      const { data } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        listener(session);
      });
      return () => data.subscription.unsubscribe();
    }

    demoListeners.add(listener);
    return () => demoListeners.delete(listener);
  },
};

export default authClient;
