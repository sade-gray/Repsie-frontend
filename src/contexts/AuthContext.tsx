import {createContext, useContext, useEffect, useState} from "react";
import { auth } from "../firebase.ts";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "firebase/auth";

// @ts-ignore TODO: Add default value so it stops complaining
const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
    // TODO: Add user type to state.
    const [user, setUser] = useState<any>();
    const [loading, setLoading] = useState(true);

    const emailSignUp = (email: string, password: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user);
            })
            .catch((error) => {
                console.log(error.message);
            })
    }
    const emailSignIn = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setUser(userCredential.user);
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
        console.log("Checking for user")
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
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