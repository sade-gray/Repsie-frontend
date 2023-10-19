import { Button } from "@mui/material";
import SignInForm from "./components/SignInForm.tsx";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Navigate} from "react-router-dom";

export default function SignIn() {
    const { user }:any = useAuth();

    if (user) {
        return <Navigate to={"/"}/>
    } else {
        return (
            <main className={"sign--in--container"}>
                <SignInForm/>
                <Button variant={"outlined"} color={"secondary"}>Sign in with Google</Button>
            </main>
        )
    }
}