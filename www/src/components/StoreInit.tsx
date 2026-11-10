import { ReactElement, useEffect } from "react";
import { initNonCriticalStores, useStores } from "models";

export const InitNonCriticalStores = ({ children }: { children: ReactElement }) => {
  const { userStore } = useStores();

  useEffect(() => {
    initNonCriticalStores().catch((err) => {
      console.error("Failed to load the lookup stores:", err);
    });

    // Resolve the session up front. Every route is public now, so nothing else would ask the server
    // who we are -- without this a logged-in user would be stuck in view-only mode. If the check
    // fails for a non-auth reason (5xx, network), the session stays unknown, so retry a few times.
    const retryDelays = [2000, 5000, 10000];
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const checkSession = (attempt: number) => {
      userStore.isLoggedIn().then(() => {
        if (cancelled || userStore.sessionChecked) return;
        if (attempt >= retryDelays.length) {
          // give up: treat as logged out so the Login button shows
          userStore.clearCurrentUser();
          return;
        }
        timer = setTimeout(() => checkSession(attempt + 1), retryDelays[attempt]);
      });
    };
    checkSession(0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [userStore]);

  return children;
};
