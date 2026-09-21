import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "lovable:chunk-reloaded";

/**
 * React.lazy with resilience against stale chunk hashes after a new deploy.
 * Retries the dynamic import once, then does a single hard reload so the
 * browser fetches the fresh asset manifest instead of showing a blank screen.
 */
export function lazyRetry<T extends ComponentType<never>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      const mod = await factory();
      sessionStorage.removeItem(RELOAD_KEY);
      return mod;
    } catch (error) {
      try {
        const mod = await factory();
        sessionStorage.removeItem(RELOAD_KEY);
        return mod;
      } catch (retryError) {
        const alreadyReloaded = sessionStorage.getItem(RELOAD_KEY) === "1";
        if (!alreadyReloaded) {
          sessionStorage.setItem(RELOAD_KEY, "1");
          window.location.reload();
          // Never resolves; the page is reloading.
          return await new Promise<{ default: T }>(() => {});
        }
        throw retryError;
      }
    }
  });
}
