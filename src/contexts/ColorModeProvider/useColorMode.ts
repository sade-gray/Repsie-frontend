import { useContext } from 'react';
import { ColorModeContext } from './ColorModeProvider';

export default function useColorMode() {
  return useContext(ColorModeContext);
}
