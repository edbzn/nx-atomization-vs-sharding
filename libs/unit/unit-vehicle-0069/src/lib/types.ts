export interface VehicleRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const VEHICLE_CATEGORIES = ['Van', 'Truck', 'Sedan', 'Bike', 'Scooter'] as const;
