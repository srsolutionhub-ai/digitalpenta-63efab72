import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface DashboardTitleState {
  title: string;
  description?: string;
}

interface DashboardTitleContextValue {
  state: DashboardTitleState;
  setState: (state: DashboardTitleState) => void;
}

const DashboardTitleContext = createContext<DashboardTitleContextValue | null>(null);

export function DashboardTitleProvider({ children, fallback }: { children: ReactNode; fallback: string }) {
  const [state, setState] = useState<DashboardTitleState>({ title: fallback });
  return (
    <DashboardTitleContext.Provider value={{ state, setState }}>
      {children}
    </DashboardTitleContext.Provider>
  );
}

/** Call from a page-level PageHeader to publish the page title into the sticky top bar. */
export function usePublishDashboardTitle(title?: string, description?: string) {
  const ctx = useContext(DashboardTitleContext);
  useEffect(() => {
    if (!ctx || !title) return;
    ctx.setState({ title, description });
  }, [ctx, title, description]);
}

export function useDashboardTitle() {
  const ctx = useContext(DashboardTitleContext);
  return ctx?.state ?? { title: "" };
}
