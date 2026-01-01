// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { PatientTable as ctPatient0045Table } from '@bench/ct-patient-0045';
import { PatientTable as ctPatient0058Table } from '@bench/ct-patient-0058';
import { AssetTable as unitAsset0051Table } from '@bench/unit-asset-0051';

export const FEATURES = {
  'ct-patient-0045': ctPatient0045Table,
  'ct-patient-0058': ctPatient0058Table,
  'unit-asset-0051': unitAsset0051Table,
} as const;
