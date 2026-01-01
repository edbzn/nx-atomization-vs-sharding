// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { InvoiceTable as ctInvoice0027Table } from '@bench/ct-invoice-0027';
import { ProductTable as ctProduct0048Table } from '@bench/ct-product-0048';
import { AssetTable as unitAsset0071Table } from '@bench/unit-asset-0071';
import { RecipeTable as unitRecipe0019Table } from '@bench/unit-recipe-0019';

export const FEATURES = {
  'ct-invoice-0027': ctInvoice0027Table,
  'ct-product-0048': ctProduct0048Table,
  'unit-asset-0071': unitAsset0071Table,
  'unit-recipe-0019': unitRecipe0019Table,
} as const;
