// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { AssetTable as unitAsset0035Table } from '@bench/unit-asset-0035';
import { CampaignTable as unitCampaign0037Table } from '@bench/unit-campaign-0037';

export const INTEGRATIONS = {
  'unit-asset-0035': unitAsset0035Table,
  'unit-campaign-0037': unitCampaign0037Table,
} as const;
