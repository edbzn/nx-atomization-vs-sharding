// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { VehicleTable as unitVehicle0010Table } from '@bench/unit-vehicle-0010';
import { CampaignTable as unitCampaign0016Table } from '@bench/unit-campaign-0016';

export const INTEGRATIONS = {
  'unit-vehicle-0010': unitVehicle0010Table,
  'unit-campaign-0016': unitCampaign0016Table,
} as const;
