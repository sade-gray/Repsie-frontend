import * as ReactDOM from 'react-dom/client';
import { Root } from './components/Root.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';
import Home from './routes/Home/Home.tsx';
import RouteNotFound from './routes/404Route/RouteNotFound.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        index: true,
        element: <Home />,
      },
      {
        path: '/recipe/:recipeId',
        async lazy() {
          const { RecipePage } = await import('./routes/Recipe/RecipePage.tsx');
          return { Component: RecipePage };
        },
      },
      {
        path: '/myRecipes',
        async lazy() {
          const { MyRecipesPage } = await import('./routes/MyRecipesPage/MyRecipesPage.tsx');
          return { Component: MyRecipesPage };
        },
      },
      {
        path: '/createRecipe/:recipeId',
        async lazy() {
          const { CreateRecipePage } = await import('./routes/CreateRecipe/CreateRecipePage.tsx');
          return { Component: CreateRecipePage };
        },
      },
      {
        path: '/signup',
        async lazy() {
          const { SignUp } = await import('./routes/SignUp/SignUp.tsx');
          return { Component: SignUp };
        },
      },
      {
        path: '/profile',
        async lazy() {
          const { ProfilePage } = await import('./routes/ProfilePage/ProfilePage.tsx');
          return { Component: ProfilePage };
        },
      },
      {
        path: '/signin',
        async lazy() {
          const { SignIn } = await import('./routes/SignIn/SignIn.tsx');
          return { Component: SignIn };
        },
      },
      {
        path: '*',
        element: <RouteNotFound />,
        errorElement: true,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <RouterProvider router={router} fallbackElement={<div>Loading your content!</div>} />
  // </React.StrictMode>
);
