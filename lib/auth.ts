export interface UserSession {
  name: string;
  email?: string;
  provider: "google" | "guest";
  avatar?: string;
  loggedInAt: string;
}

const AUTH_STORAGE_KEY = "trashformer_auth_user";
const AUTH_EVENT = "trashformer-auth-updated";

export function getAuthUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function loginUser(details: Omit<UserSession, "loggedInAt">): UserSession {
  const session: UserSession = {
    ...details,
    loggedInAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: session }));
  }
  return session;
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: null }));
  }
}

export function subscribeToAuth(callback: (user: UserSession | null) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback(getAuthUser());
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

