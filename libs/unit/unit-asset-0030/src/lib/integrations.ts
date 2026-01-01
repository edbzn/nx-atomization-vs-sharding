// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ShipmentTable as ctShipment0025Table } from '@bench/ct-shipment-0025';
import { EmployeeTable as unitEmployee0029Table } from '@bench/unit-employee-0029';

export const INTEGRATIONS = {
  'ct-shipment-0025': ctShipment0025Table,
  'unit-employee-0029': unitEmployee0029Table,
} as const;
