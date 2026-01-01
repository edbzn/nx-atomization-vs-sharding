// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { BookingTable as ctBooking0062Table } from '@bench/ct-booking-0062';

export const INTEGRATIONS = {
  'ct-booking-0062': ctBooking0062Table,
} as const;
