import { PublisherContainer } from '../routes/Recipe/components/PublisherContainer.tsx';
import { savedRecipe } from '../types/recipeTypes.ts';
import Wex from '../assets/wex.png';

export default function SavedRecipeCard({ title, imageUrl, publisher }: savedRecipe) {
  return (
    <div className={'saved--recipe--card'} style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className={'saved--recipe--card--title'}>
        <h6 className={'saved--recipe--title'}>{title}</h6>
        <PublisherContainer
          color={'white'}
          size={'small'}
          outline={'bold'}
          publisherName={publisher?.name || 'Bob'}
          publisherImageUrl={publisher?.iconUrl || Wex}
        />
      </div>
    </div>
  );
}
