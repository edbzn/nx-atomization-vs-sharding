// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { TicketTable as ctTicket0017Table } from '@bench/ct-ticket-0017';

export const INTEGRATIONS = {
  'ct-ticket-0017': ctTicket0017Table,
} as const;
