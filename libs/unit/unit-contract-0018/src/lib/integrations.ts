// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { RecipeTable as unitRecipe0009Table } from '@bench/unit-recipe-0009';
import { InvoiceTable as ctInvoice0004Table } from '@bench/ct-invoice-0004';

export const INTEGRATIONS = {
  'unit-recipe-0009': unitRecipe0009Table,
  'ct-invoice-0004': ctInvoice0004Table,
} as const;
