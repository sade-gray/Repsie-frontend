import { User as FirebaseUser } from '@firebase/auth';

export interface AuthContextValues {
  /** The currently logged-in Updated react router dom to v6.17user */
  user: FirebaseUser | null | undefined;
  emailSignUp: (email: string, password: string) => Promise<boolean>;
  emailSignIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}
