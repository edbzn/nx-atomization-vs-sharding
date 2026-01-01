// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { BookingTable as ctBooking0012Table } from '@bench/ct-booking-0012';
import { ContractTable as unitContract0033Table } from '@bench/unit-contract-0033';

export const INTEGRATIONS = {
  'ct-booking-0012': ctBooking0012Table,
  'unit-contract-0033': unitContract0033Table,
} as const;
