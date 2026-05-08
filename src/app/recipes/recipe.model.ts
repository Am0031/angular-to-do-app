export interface Recipe {
  id: number;
  name: string;
  description: string;
  category: string;
  prepTime: string;
  servings: number;
  imageUrl: string;
  ingredients: string[];
  instructions: string;
}

export interface RecipeFormData extends Omit<Recipe, 'id'> {
  id?: number;
}
