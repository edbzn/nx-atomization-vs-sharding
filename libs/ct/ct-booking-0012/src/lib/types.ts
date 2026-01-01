export interface BookingRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const BOOKING_CATEGORIES = ['Hotel', 'Flight', 'Train', 'Car', 'Tour'] as const;
