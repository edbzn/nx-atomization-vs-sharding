// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { RecipeTable as unitRecipe0009Table } from '@bench/unit-recipe-0009';
import { TicketTable as ctTicket0005Table } from '@bench/ct-ticket-0005';

export const INTEGRATIONS = {
  'unit-recipe-0009': unitRecipe0009Table,
  'ct-ticket-0005': ctTicket0005Table,
} as const;
