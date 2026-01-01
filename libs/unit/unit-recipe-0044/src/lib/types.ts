export interface RecipeRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const RECIPE_CATEGORIES = ['Starter', 'Main', 'Dessert', 'Side', 'Drink'] as const;
