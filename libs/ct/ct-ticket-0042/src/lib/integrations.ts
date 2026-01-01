// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { PatientTable as ctPatient0007Table } from '@bench/ct-patient-0007';
import { RecipeTable as unitRecipe0032Table } from '@bench/unit-recipe-0032';

export const INTEGRATIONS = {
  'ct-patient-0007': ctPatient0007Table,
  'unit-recipe-0032': unitRecipe0032Table,
} as const;
