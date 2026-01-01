// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { CampaignTable as unitCampaign0003Table } from '@bench/unit-campaign-0003';

export const INTEGRATIONS = {
  'unit-campaign-0003': unitCampaign0003Table,
} as const;
