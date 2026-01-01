export interface PatientRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const PATIENT_CATEGORIES = ['Admitted', 'Outpatient', 'Discharged', 'Referred', 'Waiting'] as const;
