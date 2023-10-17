import {
    Button,
    FilledInput,
    FormControl,
    IconButton,
    InputAdornment, InputLabel,
    TextField,
    Typography
} from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.tsx";
import {Visibility} from "@mui/icons-material";
import {VisibilityOff} from "@mui/icons-material";

export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState();
    // TODO: Add type.a
    const { user, emailSignIn }: any = useAuth();
    // TODO: Disable sign up button until form is valid.

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }

    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        console.log("Sending "+ email + " and " + password);
        emailSignIn(email, password);
        if (!user) {
            console.log("Invalid credentials");
            setLoginError("Invalid Credentials. Please try again.");
        }
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <Typography variant={"h4"}>Sign in</Typography>
            <TextField color={"secondary"}
                       label={"Email"}
                       name={"email"}
                       onChange={(e) => handleEmailChange(e)}
                       value={email}
                       placeholder={"masterchef@gmail.com"}
                       type={"email"}
                       variant={"filled"}
                       margin={"normal"}
                       fullWidth
                       required
                       sx={{display: "block"}}
            />
            <FormControl color={"secondary"} sx={{mb:1}} variant={"filled"} fullWidth>
                <InputLabel htmlFor={"password-field"}>Password</InputLabel>
                <FilledInput
                    id={"password-field"}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormControl>
            {loginError !== "" && <Typography color={"error"}>{loginError}</Typography>}
            <Button disabled={false} sx={{display: " block"}}
                    size={"large"}
                    variant={"contained"}
                    color={"secondary"}
                    type={"submit"}
            > Sign in
            </Button>
        </form>
    )
}