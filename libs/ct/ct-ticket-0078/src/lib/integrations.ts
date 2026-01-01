// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { PatientTable as ctPatient0058Table } from '@bench/ct-patient-0058';
import { PatientTable as ctPatient0024Table } from '@bench/ct-patient-0024';

export const INTEGRATIONS = {
  'ct-patient-0058': ctPatient0058Table,
  'ct-patient-0024': ctPatient0024Table,
} as const;
