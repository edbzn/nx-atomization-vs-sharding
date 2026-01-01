// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { EmployeeTable as unitEmployee0011Table } from '@bench/unit-employee-0011';

export const INTEGRATIONS = {
  'unit-employee-0011': unitEmployee0011Table,
} as const;
