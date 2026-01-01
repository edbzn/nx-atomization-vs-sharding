// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { PatientTable as ctPatient0009Table } from '@bench/ct-patient-0009';
import { TicketTable as ctTicket0015Table } from '@bench/ct-ticket-0015';
import { CampaignTable as unitCampaign0031Table } from '@bench/unit-campaign-0031';
import { EmployeeTable as unitEmployee0036Table } from '@bench/unit-employee-0036';

export const FEATURES = {
  'ct-patient-0009': ctPatient0009Table,
  'ct-ticket-0015': ctTicket0015Table,
  'unit-campaign-0031': unitCampaign0031Table,
  'unit-employee-0036': unitEmployee0036Table,
} as const;
