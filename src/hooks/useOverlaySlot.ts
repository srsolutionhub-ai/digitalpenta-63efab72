import { useEffect, useSyncExternalStore } from "react";
import { overlayBus, OverlayId } from "@/lib/overlayOrchestrator";

/**
 * Returns whether THIS overlay currently owns the bottom slot.
 * Components call request() when they want to be visible; the bus picks the
 * highest-priority requester.
 */
export function useOverlaySlot(id: OverlayId, wantsToShow: boolean) {
  useEffect(() => {
    if (wantsToShow) overlayBus.request(id);
    else overlayBus.release(id);
    return () => overlayBus.release(id);
  }, [id, wantsToShow]);

  const active = useSyncExternalStore(
    overlayBus.subscribe,
    () => overlayBus.active(),
    () => null
  );

  return wantsToShow && active === id;
}
