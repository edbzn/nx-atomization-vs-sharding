// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { PatientTable as ctPatient0028Table } from '@bench/ct-patient-0028';
import { ShipmentTable as ctShipment0016Table } from '@bench/ct-shipment-0016';
import { RecipeTable as unitRecipe0034Table } from '@bench/unit-recipe-0034';
import { VehicleTable as unitVehicle0035Table } from '@bench/unit-vehicle-0035';

export const FEATURES = {
  'ct-patient-0028': ctPatient0028Table,
  'ct-shipment-0016': ctShipment0016Table,
  'unit-recipe-0034': unitRecipe0034Table,
  'unit-vehicle-0035': unitVehicle0035Table,
} as const;
