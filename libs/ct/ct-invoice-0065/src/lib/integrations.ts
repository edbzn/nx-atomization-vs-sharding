// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { EmployeeTable as unitEmployee0059Table } from '@bench/unit-employee-0059';

export const INTEGRATIONS = {
  'unit-employee-0059': unitEmployee0059Table,
} as const;
