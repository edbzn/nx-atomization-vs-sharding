// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { PatientTable as ctPatient0007Table } from '@bench/ct-patient-0007';
import { ContractTable as unitContract0018Table } from '@bench/unit-contract-0018';

export const INTEGRATIONS = {
  'ct-patient-0007': ctPatient0007Table,
  'unit-contract-0018': unitContract0018Table,
} as const;
