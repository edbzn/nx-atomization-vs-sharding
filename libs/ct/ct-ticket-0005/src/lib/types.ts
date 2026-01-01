export interface TicketRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const TICKET_CATEGORIES = ['Bug', 'Feature', 'Question', 'Incident', 'Chore'] as const;
