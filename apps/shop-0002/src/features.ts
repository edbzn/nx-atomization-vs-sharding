// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { ProductTable as ctProduct0002Table } from '@bench/ct-product-0002';
import { ShipmentTable as ctShipment0031Table } from '@bench/ct-shipment-0031';
import { TicketTable as ctTicket0078Table } from '@bench/ct-ticket-0078';
import { VehicleTable as unitVehicle0069Table } from '@bench/unit-vehicle-0069';

export const FEATURES = {
  'ct-product-0002': ctProduct0002Table,
  'ct-shipment-0031': ctShipment0031Table,
  'ct-ticket-0078': ctTicket0078Table,
  'unit-vehicle-0069': unitVehicle0069Table,
} as const;
