import {createContext, useContext} from "react";
import { IContextType } from "../types/contextTypes.ts";

export const DrawerContext = createContext<IContextType>({
    drawerOpen: false,
    setDrawerOpen: () => {},
});

export function useDrawerContext() {
    return useContext(DrawerContext);
}