export interface ShipmentRow {
  id: string;
  name: string;
  category: string;
  /** Amount in cents. */
  amount: number;
}

export const SHIPMENT_CATEGORIES = ['Pending', 'Packed', 'Transit', 'Delivered', 'Returned'] as const;
