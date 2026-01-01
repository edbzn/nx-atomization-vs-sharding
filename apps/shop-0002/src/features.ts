// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { InvoiceTable as ctInvoice0039Table } from '@bench/ct-invoice-0039';
import { PatientTable as ctPatient0018Table } from '@bench/ct-patient-0018';
import { ContractTable as unitContract0023Table } from '@bench/unit-contract-0023';
import { EmployeeTable as unitEmployee0036Table } from '@bench/unit-employee-0036';

export const FEATURES = {
  'ct-invoice-0039': ctInvoice0039Table,
  'ct-patient-0018': ctPatient0018Table,
  'unit-contract-0023': unitContract0023Table,
  'unit-employee-0036': unitEmployee0036Table,
} as const;
