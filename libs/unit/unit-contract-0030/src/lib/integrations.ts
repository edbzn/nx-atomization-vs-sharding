// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ShipmentTable as ctShipment0020Table } from '@bench/ct-shipment-0020';
import { CampaignTable as unitCampaign0028Table } from '@bench/unit-campaign-0028';

export const INTEGRATIONS = {
  'ct-shipment-0020': ctShipment0020Table,
  'unit-campaign-0028': unitCampaign0028Table,
} as const;
