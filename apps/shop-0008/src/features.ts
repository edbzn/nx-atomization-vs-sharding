// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { PatientTable as ctPatient0045Table } from '@bench/ct-patient-0045';
import { CampaignTable as unitCampaign0053Table } from '@bench/unit-campaign-0053';
import { RecipeTable as unitRecipe0032Table } from '@bench/unit-recipe-0032';

export const FEATURES = {
  'ct-patient-0045': ctPatient0045Table,
  'unit-campaign-0053': unitCampaign0053Table,
  'unit-recipe-0032': unitRecipe0032Table,
} as const;
