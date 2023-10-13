import {createContext, useContext, useState} from "react";
import { IContextType } from "../types/contextTypes.ts";

export const DrawerContext = createContext<IContextType>({
    drawerOpen: false,
    setDrawerOpen: () => {},
});

export function useDrawer() {
    return useContext(DrawerContext);
}

export function DrawerProvider({ children }: any) {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

    return (
        <DrawerContext.Provider value={{drawerOpen, setDrawerOpen}}>
            {children}
        </DrawerContext.Provider>
    )
}