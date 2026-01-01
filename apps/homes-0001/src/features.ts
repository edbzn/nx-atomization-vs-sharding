// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { InvoiceTable as ctInvoice0039Table } from '@bench/ct-invoice-0039';
import { RecipeTable as unitRecipe0008Table } from '@bench/unit-recipe-0008';
import { RecipeTable as unitRecipe0026Table } from '@bench/unit-recipe-0026';
import { RecipeTable as unitRecipe0034Table } from '@bench/unit-recipe-0034';

export const FEATURES = {
  'ct-invoice-0039': ctInvoice0039Table,
  'unit-recipe-0008': unitRecipe0008Table,
  'unit-recipe-0026': unitRecipe0026Table,
  'unit-recipe-0034': unitRecipe0034Table,
} as const;
