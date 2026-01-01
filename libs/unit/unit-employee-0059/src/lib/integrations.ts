// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { ProductTable as ctProduct0048Table } from '@bench/ct-product-0048';
import { EmployeeTable as unitEmployee0049Table } from '@bench/unit-employee-0049';

export const INTEGRATIONS = {
  'ct-product-0048': ctProduct0048Table,
  'unit-employee-0049': unitEmployee0049Table,
} as const;
