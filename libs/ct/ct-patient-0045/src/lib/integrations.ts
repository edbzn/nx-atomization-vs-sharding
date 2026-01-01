// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { RecipeTable as unitRecipe0032Table } from '@bench/unit-recipe-0032';
import { CampaignTable as unitCampaign0037Table } from '@bench/unit-campaign-0037';

export const INTEGRATIONS = {
  'unit-recipe-0032': unitRecipe0032Table,
  'unit-campaign-0037': unitCampaign0037Table,
} as const;
