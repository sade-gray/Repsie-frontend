import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useAuth from "@context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // TODO: Disable sign up button until form is valid.
  // TODO: Add type.
  const { user, emailSignUp } = useAuth();

  const navigate = useNavigate();
  // TODO: Redirect only if successful.
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Sending " + email + " and " + password);
    // If the email sign up is successful, the user will change.
    await emailSignUp(email, password);
    if (!user) {
      console.log("Invalid credentials");
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Typography variant={"h4"}>Sign up</Typography>
      <TextField
        color={"secondary"}
        label={"Email"}
        name={"email"}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder={"masterchef@gmail.com"}
        type={"email"}
        variant={"filled"}
        margin={"normal"}
        sx={{ display: "block" }}
      />
      <TextField
        color={"secondary"}
        id={"outlined-basic"}
        name={"password"}
        onChange={(e) => setPassword(e.target.value)}
        label={"Password"}
        variant={"filled"}
        margin={"normal"}
        type={"password"}
      />
      <Button
        disabled={false}
        sx={{ display: " block" }}
        size={"large"}
        variant={"contained"}
        color={"secondary"}
        type={"submit"}
      >
        Sign up
      </Button>
    </form>
  );
}
