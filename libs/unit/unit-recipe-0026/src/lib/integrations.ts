// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ProductTable as ctProduct0021Table } from '@bench/ct-product-0021';
import { TicketTable as ctTicket0024Table } from '@bench/ct-ticket-0024';

export const INTEGRATIONS = {
  'ct-product-0021': ctProduct0021Table,
  'ct-ticket-0024': ctTicket0024Table,
} as const;
