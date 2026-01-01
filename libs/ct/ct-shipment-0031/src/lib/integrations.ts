// Cross-library integrations: lower-layer libs this one builds on (Nx infers the project
// dependencies from these imports through the tsconfig.base.json path aliases).
import { PatientTable as ctPatient0024Table } from '@bench/ct-patient-0024';
import { InvoiceTable as ctInvoice0027Table } from '@bench/ct-invoice-0027';

export const INTEGRATIONS = {
  'ct-patient-0024': ctPatient0024Table,
  'ct-invoice-0027': ctInvoice0027Table,
} as const;
