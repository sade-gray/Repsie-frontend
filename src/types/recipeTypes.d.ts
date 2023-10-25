export interface savedRecipe {
    title: string,
    imageUrl: string,
    publisher: {
        name: string,
        iconUrl: string
    }
}

export interface RecipeCard {
    id: string
    title: string,
    skillRating: number,
    timeRating: number,
    image: string,
    savedByUser: boolean
}

interface RecipeCardData {
    id: string,
    title: string,
    imageUrl: string,
    publisherName: string,
    publisherImageUrl: string
    saved: boolean
}