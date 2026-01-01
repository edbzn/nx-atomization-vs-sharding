// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { BookingTable as ctBooking0046Table } from '@bench/ct-booking-0046';
import { CampaignTable as unitCampaign0016Table } from '@bench/unit-campaign-0016';
import { EmployeeTable as unitEmployee0011Table } from '@bench/unit-employee-0011';
import { RecipeTable as unitRecipe0068Table } from '@bench/unit-recipe-0068';

export const FEATURES = {
  'ct-booking-0046': ctBooking0046Table,
  'unit-campaign-0016': unitCampaign0016Table,
  'unit-employee-0011': unitEmployee0011Table,
  'unit-recipe-0068': unitRecipe0068Table,
} as const;
