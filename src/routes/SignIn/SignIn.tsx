import { Button } from "@mui/material";
import SignInForm from "./components/SignInForm.tsx";

export default function SignIn() {

    return (
        <main className={"sign--in--container"}>
            <SignInForm />
            <Button variant={"outlined"} color={"secondary"}>Sign in with Google</Button>
        </main>
    )
}