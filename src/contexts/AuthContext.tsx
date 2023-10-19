import {createContext, useContext, useEffect, useState} from "react";
import { auth } from "../firebase.ts";
import { User as FirebaseUser } from "firebase/auth";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {useSnackBar} from "./SnackBarContext.tsx";
import {useNavigate} from "react-router-dom";
import {AuthContextValues} from "../types/authTypes.ts";

const AuthContext = createContext({} as AuthContextValues);

export function useAuth() {
    return useContext<AuthContextValues>(AuthContext);
}

export function AuthProvider({ children }: any) {
    // TODO: Add user type to state.
    const [user, setUser] = useState<FirebaseUser | null |undefined>();
    const [loading, setLoading] = useState(true);
    const { addSnack }: any = useSnackBar();
    const navigate = useNavigate();

    const emailSignUp = async (email: string, password: string): Promise<boolean> => {
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
                return false;
            })
        return false;
    }
    const emailSignIn = async (email: string, password: string): Promise<boolean> => {
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                if ((user)) {
                    setUser(user);
                    addSnack(`Success! Logged in as ${user.displayName || user.email}`);
                    navigate("/")
                    return true;
                }
                return false;
            })
            .catch((error) => {
                console.log(error.message);
                return false;
            })
        return false
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


    const value: AuthContextValues= {
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