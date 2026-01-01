// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { VehicleTable as unitVehicle0057Table } from '@bench/unit-vehicle-0057';

export const INTEGRATIONS = {
  'unit-vehicle-0057': unitVehicle0057Table,
} as const;
