import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {Root} from "./components/Root.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./index.scss";
import RecipePage from "./routes/Recipe/RecipePage.tsx";
import Home from "./routes/Home/Home.tsx";
import CreateRecipePage from "./routes/CreateRecipe/CreateRecipePage.tsx";
import MyRecipesPage from "./routes/MyRecipesPage/MyRecipesPage.tsx";
import RouteNotFound from "./routes/404Route/RouteNotFound.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/recipe",
                element: <RecipePage />,
            },
            {
                path: "/myRecipes",
                element: <MyRecipesPage />,
            },
            {
                path: "/createRecipe",
                element: <CreateRecipePage />,
            },
            {
                path:"/:any",
                element: <RouteNotFound />,
                errorElement: true,
            }
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
