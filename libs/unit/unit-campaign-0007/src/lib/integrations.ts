// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { PatientTable as ctPatient0006Table } from '@bench/ct-patient-0006';

export const INTEGRATIONS = {
  'ct-patient-0006': ctPatient0006Table,
} as const;
