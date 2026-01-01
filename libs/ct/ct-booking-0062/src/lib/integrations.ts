// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { AssetTable as unitAsset0051Table } from '@bench/unit-asset-0051';
import { CampaignTable as unitCampaign0053Table } from '@bench/unit-campaign-0053';

export const INTEGRATIONS = {
  'unit-asset-0051': unitAsset0051Table,
  'unit-campaign-0053': unitCampaign0053Table,
} as const;
