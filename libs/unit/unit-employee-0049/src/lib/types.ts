export interface EmployeeRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const EMPLOYEE_CATEGORIES = ['Engineering', 'Sales', 'Finance', 'Support', 'Legal'] as const;
