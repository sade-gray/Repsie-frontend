import { Link } from "react-router-dom"

export default function AddRecipeButton() {
    return (
        <div className="my--recipe--item" id="">
            <Link to="/createRecipe">
                +
            </Link>
        </div>
    )
}