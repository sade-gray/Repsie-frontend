import {User as FirebaseUser} from "@firebase/auth";

export interface AuthContextValues {
    user: FirebaseUser | null | undefined,
    emailSignUp: (email: string, password: string) => Promise<boolean>,
    emailSignIn: (email: string, password: string) => Promise<boolean>,
    signOut: () => void,
}