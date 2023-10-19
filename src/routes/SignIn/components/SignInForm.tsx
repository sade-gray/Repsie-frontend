import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

export default function SignInForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // TODO: Disable sign up button until form is valid.
    // TODO: Add type.
    const { emailSignIn }: any = useAuth();

    const navigate = useNavigate();
    // TODO: Redirect only if succesful.
    const handleFormSubmit = async (e: any) => {
        e.preventDefault();
        console.log("Sending "+ email + " and " + password);
        if (emailSignIn(email, password)) {
            console.log("Invalid credentials")
        } else {
            navigate("/");
        }
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <Typography variant={"h4"}>Sign in</Typography>
            <TextField color={"secondary"}
                       label={"Email"}
                       name={"email"}
                       onChange={(e) => setEmail(e.target.value)}
                       value={email}
                       placeholder={"masterchef@gmail.com"}
                       type={"email"}
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
                       type={"password"}
            />
            <Button disabled={false} sx={{display: " block"}}
                    size={"large"}
                    variant={"contained"}
                    color={"secondary"}
                    type={"submit"}
            >Sign in</Button>
        </form>
    )
}