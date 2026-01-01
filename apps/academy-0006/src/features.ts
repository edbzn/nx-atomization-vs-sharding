// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { ProductTable as ctProduct0013Table } from '@bench/ct-product-0013';
import { TicketTable as ctTicket0005Table } from '@bench/ct-ticket-0005';
import { RecipeTable as unitRecipe0019Table } from '@bench/unit-recipe-0019';
import { RecipeTable as unitRecipe0056Table } from '@bench/unit-recipe-0056';

export const FEATURES = {
  'ct-product-0013': ctProduct0013Table,
  'ct-ticket-0005': ctTicket0005Table,
  'unit-recipe-0019': unitRecipe0019Table,
  'unit-recipe-0056': unitRecipe0056Table,
} as const;
