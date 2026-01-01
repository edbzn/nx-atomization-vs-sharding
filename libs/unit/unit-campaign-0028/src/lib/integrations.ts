// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { BookingTable as ctBooking0012Table } from '@bench/ct-booking-0012';
import { InvoiceTable as ctInvoice0015Table } from '@bench/ct-invoice-0015';

export const INTEGRATIONS = {
  'ct-booking-0012': ctBooking0012Table,
  'ct-invoice-0015': ctInvoice0015Table,
} as const;
