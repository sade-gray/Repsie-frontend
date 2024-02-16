import { Dispatch, SetStateAction } from "react";

export interface IContextType {
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}
