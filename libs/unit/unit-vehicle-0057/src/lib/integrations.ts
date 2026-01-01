// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { InvoiceTable as ctInvoice0041Table } from '@bench/ct-invoice-0041';
import { BookingTable as ctBooking0046Table } from '@bench/ct-booking-0046';

export const INTEGRATIONS = {
  'ct-invoice-0041': ctInvoice0041Table,
  'ct-booking-0046': ctBooking0046Table,
} as const;
