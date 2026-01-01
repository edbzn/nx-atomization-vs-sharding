// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { InvoiceTable as ctInvoice0041Table } from '@bench/ct-invoice-0041';
import { CampaignTable as unitCampaign0037Table } from '@bench/unit-campaign-0037';
import { EmployeeTable as unitEmployee0022Table } from '@bench/unit-employee-0022';

export const FEATURES = {
  'ct-invoice-0041': ctInvoice0041Table,
  'unit-campaign-0037': unitCampaign0037Table,
  'unit-employee-0022': unitEmployee0022Table,
} as const;
