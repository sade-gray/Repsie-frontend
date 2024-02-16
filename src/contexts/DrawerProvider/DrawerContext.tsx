import { createContext, ReactNode, useState } from "react";
import { IContextType } from "../../types/contextTypes";

export const DrawerContext = createContext<IContextType>({
  drawerOpen: false,
  setDrawerOpen: () => {},
});

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <DrawerContext.Provider value={{ drawerOpen, setDrawerOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}
