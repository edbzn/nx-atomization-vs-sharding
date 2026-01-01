// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { VehicleTable as unitVehicle0021Table } from '@bench/unit-vehicle-0021';
import { BookingTable as ctBooking0025Table } from '@bench/ct-booking-0025';

export const INTEGRATIONS = {
  'unit-vehicle-0021': unitVehicle0021Table,
  'ct-booking-0025': ctBooking0025Table,
} as const;
