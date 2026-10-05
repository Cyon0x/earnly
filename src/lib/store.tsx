"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEMO_APPLICATIONS,
  DEMO_NOTIFS,
  DEMO_STUDENT,
  DEMO_TXNS,
} from "./data";
import { DEFAULT_PREFS } from "./ai";
import type {
  AiPrefs,
  AiResult,
  AppStage,
  Application,
  Notif,
  Student,
  Txn,
  VerificationState,
} from "./types";

const KEY = "earnly:v2";

interface Persisted {
  signedIn: boolean;
  authMethod: "google" | "email" | null;
  verification: VerificationState;
  onboarded: boolean;
  prefs: AiPrefs;
  aiPrefs: AiPrefs;
  saved: string[];
  applications: Application[];
  notifications: Notif[];
  theme: "dark" | "light";
}

const initial: Persisted = {
  signedIn: false,
  authMethod: null,
  verification: "required",
  onboarded: false,
  prefs: DEFAULT_PREFS,
  aiPrefs: DEFAULT_PREFS,
  saved: ["t-website-designer", "i-react-intern"],
  applications: DEMO_APPLICATIONS,
  notifications: DEMO_NOTIFS,
  theme: "dark",
};

interface Ctx extends Persisted {
  student: Student;
  txns: Txn[];
  ready: boolean;
  signIn: (method: "google" | "email") => void;
  signOut: () => void;
  submitVerification: () => void;
  approveVerification: () => void;
  failVerification: () => void;
  resetVerification: () => void;
  completeOnboarding: (prefs: AiPrefs) => void;
  saveAiPrefs: (prefs: AiPrefs) => void;
  apply: (opportunityId: string) => void;
  advance: (applicationId: string) => void;
  toggleSaved: (opportunityId: string) => void;
  markAllRead: () => void;
  setTheme: (t: "dark" | "light") => void;
  setAiResults: (r: AiResult[] | null) => void;
  aiResults: AiResult[] | null;
  reset: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);
  const [ready, setReady] = useState(false);
  const [aiResults, setAiResults] = useState<AiResult[] | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      // Hydration: the persisted store can only be read on the client, so this
      // one synchronous setState is the intentional hand-off from SSR. The
      // splash in AppShell keeps the first paint identical.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState({ ...initial, ...(JSON.parse(raw) as Persisted) });
    } catch {
      /* a prototype store; a corrupt value just starts fresh */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* private mode */
    }
    document.documentElement.dataset.theme = state.theme;
  }, [state, ready]);

  const update = useCallback((patch: Partial<Persisted>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const value = useMemo<Ctx>(() => {
    return {
      ...state,
      student: DEMO_STUDENT,
      txns: DEMO_TXNS,
      ready,
      aiResults,
      setAiResults,
      signIn: (method) =>
        update({ signedIn: true, authMethod: method, verification: "required" }),
      signOut: () => update({ signedIn: false, authMethod: null }),
      submitVerification: () => update({ verification: "pending" }),
      approveVerification: () => update({ verification: "verified" }),
      failVerification: () => update({ verification: "failed" }),
      resetVerification: () => update({ verification: "required" }),
      completeOnboarding: (prefs) =>
        update({ onboarded: true, prefs, aiPrefs: prefs }),
      saveAiPrefs: (prefs) => update({ aiPrefs: prefs }),
      apply: (opportunityId) =>
        setState((s) =>
          s.applications.some((a) => a.opportunityId === opportunityId)
            ? s
            : {
                ...s,
                applications: [
                  {
                    id: `a${Date.now()}`,
                    opportunityId,
                    stage: "Applied" as AppStage,
                    updatedDaysAgo: 0,
                  },
                  ...s.applications,
                ],
              }
        ),
      advance: (applicationId) =>
        setState((s) => ({
          ...s,
          applications: s.applications.map((a) =>
            a.id === applicationId
              ? { ...a, stage: nextStage(a.stage), updatedDaysAgo: 0 }
              : a
          ),
        })),
      toggleSaved: (opportunityId) =>
        setState((s) => ({
          ...s,
          saved: s.saved.includes(opportunityId)
            ? s.saved.filter((x) => x !== opportunityId)
            : [opportunityId, ...s.saved],
        })),
      markAllRead: () =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => ({ ...n, unread: false })),
        })),
      setTheme: (theme) => update({ theme }),
      reset: () => {
        setState(initial);
        setAiResults(null);
      },
    };
  }, [state, ready, aiResults, update]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

function nextStage(stage: AppStage): AppStage {
  const order: AppStage[] = [
    "Applied",
    "Accepted",
    "In progress",
    "Submitted",
    "Completed",
    "Paid",
  ];
  const i = order.indexOf(stage);
  return order[Math.min(i + 1, order.length - 1)];
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
