export async function getSavedRecipes(userId: string) {
  return fetch(`http://localhost:8000/saved?user=${userId}`)
    .then(res => res.json())
    .then(savedRecipes => {
      return savedRecipes
    })
}

/**
 * Saves a recipe to a user's profile
 * TODO: add authorisation (anyone can save a recipe to anyone else's profile)
 * @param recipeId
 * @param userId
 * @return whether the recipe could be saved or not
 */
export async function saveRecipe(recipeId: string, userId: string) {
  return fetch(`http://localhost:8000/saved?user=${userId}`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: recipeId
    })
  }).then(res => res.json())
    .then(data => {
      if (data.error) {
        console.error(data.error);
        return false;
      }
      return true;
    })
}

/**
 * Unsaves a recipe from a user's profile
 * @param recipeId
 * @param userId
 * @return whether the recipe was unsaved or not.
 */
export async function unsaveRecipe(recipeId: string, userId: string) {
  return fetch(`http://localhost:8000/saved?user=${userId}`, {
    method: "DELETE",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: recipeId
    })
  }).then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.error) {
        console.error(data.error);
        return false;
      }
      return true;
    })
}
