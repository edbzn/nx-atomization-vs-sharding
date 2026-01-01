// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ShipmentTable as ctShipment0067Table } from '@bench/ct-shipment-0067';
import { ContractTable as unitContract0008Table } from '@bench/unit-contract-0008';

export const INTEGRATIONS = {
  'ct-shipment-0067': ctShipment0067Table,
  'unit-contract-0008': unitContract0008Table,
} as const;
