import { AddRounded } from "@mui/icons-material"
import { Typography, Button } from "@mui/material"
import { Link } from "react-router-dom"

export default function AddRecipeButton() {
    return (
        <Button>
            <Link to="/createRecipe" className="my--recipe--item" id="create--recipe--button">
                <AddRounded sx={{width: "50%", height: "50%"}} color="secondary"/>
                <Typography fontWeight={"bold"} fontSize={"large"} fontFamily={"inherit"} sx={{margin:0}} color="secondary">Create</Typography>
            </Link>
        </Button>
    )
}