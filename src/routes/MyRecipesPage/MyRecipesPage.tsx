import SavedRecipesContainer from '../../components/SavedRecipesContainer';
import { useEffect, useState } from 'react';
import CreateRecipeButton from './Components/CreateRecipeButton';
import { Button, Chip } from '@mui/material';
import useAuth from '@context/AuthProvider';
import { Link, Navigate } from 'react-router-dom';
import { getCreatedRecipes } from '@api/recipe.ts';

export function MyRecipesPage() {
  // @ts-ignore
  const [createdRecipes, setCreatedRecipes] = useState<any[]>([]);
  const { user } = useAuth();

  // Re fetch the recipes created by the user whenever the user changes
  useEffect(() => {
    if (!user) return;

    getCreatedRecipes(user.uid).then(createdRecipes => setCreatedRecipes(createdRecipes));
  }, [user]);

  const createdRecipesComponents = createdRecipes?.map((recipe: any) => {
    return (
      <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="my--recipe--item">
        <Button>
          <div style={{ backgroundImage: `url(${recipe.imageUrl}` }}>
            <Chip label={recipe.title} variant="filled" color="secondary" />
          </div>
        </Button>
      </Link>
    );
  });

  // Redirect to home if user is not logged in
  if (!user) {
    return <Navigate to={'/'} />;
  }
  return (
    <div className={'main--container'}>
      <section className={'saved--recipe--section'}>
        <SavedRecipesContainer />
      </section>
      <section className={'my--recipes--section'}>
        <h2>My Recipes</h2>
        <div className={'my--recipes--container'}>
          {createdRecipesComponents}
          <CreateRecipeButton />
        </div>
      </section>
    </div>
  );
}
