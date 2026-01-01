// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ContractTable as unitContract0023Table } from '@bench/unit-contract-0023';
import { VehicleTable as unitVehicle0010Table } from '@bench/unit-vehicle-0010';

export const INTEGRATIONS = {
  'unit-contract-0023': unitContract0023Table,
  'unit-vehicle-0010': unitVehicle0010Table,
} as const;
