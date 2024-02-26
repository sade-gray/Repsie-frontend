import { useContext } from 'react';
import { UserDataContext } from './UserDataContext.tsx';

export default function useUserData() {
  return useContext(UserDataContext);
}
