import { useContext } from 'react';
import { SnackBarContext } from '@context/SnackBarProvider/SnackBarContext.tsx';

export default function useSnackBar() {
  return useContext(SnackBarContext);
}
