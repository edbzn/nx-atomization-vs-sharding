// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { AssetTable as unitAsset0023Table } from '@bench/unit-asset-0023';
import { ShipmentTable as ctShipment0020Table } from '@bench/ct-shipment-0020';

export const INTEGRATIONS = {
  'unit-asset-0023': unitAsset0023Table,
  'ct-shipment-0020': ctShipment0020Table,
} as const;
