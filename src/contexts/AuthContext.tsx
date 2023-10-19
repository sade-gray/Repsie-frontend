import {createContext, useContext, useEffect, useState} from "react";
import { auth } from "../firebase.ts";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {useSnackBar} from "./SnackBarContext.tsx";

// @ts-ignore TODO: Add default value so it stops complaining
const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
    // TODO: Add user type to state.
    const [user, setUser] = useState<any>();
    const [loading, setLoading] = useState(true);
    const { addSnack }: any = useSnackBar();

    const emailSignUp = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                if ((user)) {
                    setUser(user);
                    addSnack(`Success! Logged in as ${user.displayName || user.email}`);
                    return true;
                }
                return false;
            })
            .catch((error) => {
                console.log(error.message);
            })
    }
    const emailSignIn = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                if ((user)) {
                    setUser(user);
                    addSnack(`Success! Logged in as ${user.displayName || user.email}`);
                    return true;
                }
                return false;
            })
            .catch((error) => {
                console.log(error.message);
            })
    }
    const signOut = () => {
        return auth.signOut();
    }
    // TODO: Add update email and password functions
    // TODO: Add Google Auth.

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
    }, [])


    const value= {
        user,
        emailSignUp,
        emailSignIn,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}