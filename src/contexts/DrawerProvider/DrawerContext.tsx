import { createContext, ReactNode, useState } from "react";
import { IContextType } from "../../types/contextTypes";

/** The context values to export as the API*/
export const DrawerContext = createContext<IContextType>({
  drawerOpen: false,
  setDrawerOpen: () => {},
});

/**
 * Provides the app with the ability to toggle the saved recipes drawer on or off
 * @param children the app to wrap
 */
export function DrawerProvider({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <DrawerContext.Provider value={{ drawerOpen, setDrawerOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}
