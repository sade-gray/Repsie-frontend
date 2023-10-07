import {Button} from "@mui/material";
import SignUpForm from "./components/SignUpForm.tsx";

export default function SignUp() {
    return (
        <main className={"sign--up--container"}>
            <SignUpForm/>
            <Button variant={"outlined"} color={"secondary"}>Sign up with Google</Button>
        </main>
    )
}