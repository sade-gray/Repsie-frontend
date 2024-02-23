import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material";
import fullLogo from "../../assets/logo.svg";
import shortLogo from "/favicon.svg?url";
import { Link } from "react-router-dom";

export default function RepsieLogo() {
  const theme = useTheme();
  return (
    <Link to={"/"}>
      <img
        className={"repsie--logo"}
        src={useMediaQuery(theme.breakpoints.up("sm")) ? fullLogo : shortLogo}
        alt={"Repsie logo"}
      />
    </Link>
  );
}
