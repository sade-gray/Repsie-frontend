import {Button, TextField, Typography} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.tsx";

export default function SignUpForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // TODO: Disable sign up button until form is valid.
    // TODO: Add type.
    const { emailSignUp }: any = useAuth();

    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        console.log("Sending "+ email + " and " + password);
        emailSignUp(email, password);
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <Typography variant={"h4"}>Sign up</Typography>
            <TextField color={"secondary"}
                       label={"Email"}
                       name={"email"}
                       onChange={(e) => setEmail(e.target.value)}
                       value={email}
                       placeholder={"masterchef@gmail.com"}
                       variant={"filled"}
                       margin={"normal"}
                       sx={{display: "block"}}
            />
            <TextField color={"secondary"}
                       id={"outlined-basic"}
                       name={"password"}
                       onChange={(e) => setPassword(e.target.value)}
                       label={"Password"}
                       variant={"filled"}
                       margin={"normal"}
            />
            <Button disabled={false} sx={{display: " block"}}
                    size={"large"}
                    variant={"contained"}
                    color={"secondary"}
                    type={"submit"}
            >Sign up</Button>
        </form>
    );
}