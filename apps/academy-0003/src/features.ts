// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { VehicleTable as unitVehicle0010Table } from '@bench/unit-vehicle-0010';
import { VehicleTable as unitVehicle0033Table } from '@bench/unit-vehicle-0033';

export const FEATURES = {
  'unit-vehicle-0010': unitVehicle0010Table,
  'unit-vehicle-0033': unitVehicle0033Table,
} as const;
