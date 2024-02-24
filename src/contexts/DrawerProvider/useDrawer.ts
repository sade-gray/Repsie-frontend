import { useContext } from 'react';
import { DrawerContext } from '@context/DrawerProvider/DrawerContext.tsx';

export default function useDrawer() {
  return useContext(DrawerContext);
}
