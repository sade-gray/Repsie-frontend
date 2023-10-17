import {Button, Typography} from "@mui/material";
import SignInForm from "./components/SignInForm.tsx";
import {Link} from "react-router-dom";

export default function SignIn() {

    return (
        <main className={"sign--in--container"}>
            <SignInForm />
            <Typography color={"secondary"}>
                Don't have an account?<Link to={"/signup"}> <u>Sign up!</u></Link>
            </Typography>
            <Button variant={"outlined"} color={"secondary"}>Sign in with Google</Button>
        </main>
    )
}