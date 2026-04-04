"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  AuthPayload,
  AuthResponse,
  RegisterPayload,
  SessionUser,
  loginUser,
  registerUser
} from "@/lib/api";

const STORAGE_KEY = "brickflow-session";

type SessionState = {
  token: string;
  user: SessionUser;
};

type AuthContextValue = {
  session: SessionState | null;
  isHydrated: boolean;
  login: (payload: AuthPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const rawSession = window.localStorage.getItem(STORAGE_KEY);

    if (rawSession) {
      try {
        setSession(JSON.parse(rawSession) as SessionState);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsHydrated(true);
  }, []);

  const persistSession = (auth: AuthResponse) => {
    const nextSession = {
      token: auth.token,
      user: auth.user
    };

    setSession(nextSession);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isHydrated,
      async login(payload) {
        const auth = await loginUser(payload);
        persistSession(auth);
        return auth;
      },
      async register(payload) {
        const auth = await registerUser(payload);
        persistSession(auth);
        return auth;
      },
      logout() {
        setSession(null);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }),
    [isHydrated, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
