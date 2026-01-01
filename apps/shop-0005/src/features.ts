// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { PatientTable as ctPatient0007Table } from '@bench/ct-patient-0007';
import { VehicleTable as unitVehicle0057Table } from '@bench/unit-vehicle-0057';

export const FEATURES = {
  'ct-patient-0007': ctPatient0007Table,
  'unit-vehicle-0057': unitVehicle0057Table,
} as const;
