// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ShipmentTable as ctShipment0055Table } from '@bench/ct-shipment-0055';
import { AssetTable as unitAsset0051Table } from '@bench/unit-asset-0051';

export const INTEGRATIONS = {
  'ct-shipment-0055': ctShipment0055Table,
  'unit-asset-0051': unitAsset0051Table,
} as const;
