// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { BookingTable as ctBooking0020Table } from '@bench/ct-booking-0020';

export const INTEGRATIONS = {
  'ct-booking-0020': ctBooking0020Table,
} as const;
