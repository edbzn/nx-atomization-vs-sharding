// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { RecipeTable as unitRecipe0034Table } from '@bench/unit-recipe-0034';
import { CampaignTable as unitCampaign0031Table } from '@bench/unit-campaign-0031';

export const INTEGRATIONS = {
  'unit-recipe-0034': unitRecipe0034Table,
  'unit-campaign-0031': unitCampaign0031Table,
} as const;
