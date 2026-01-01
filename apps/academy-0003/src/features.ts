// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { ShipmentTable as ctShipment0025Table } from '@bench/ct-shipment-0025';
import { ContractTable as unitContract0023Table } from '@bench/unit-contract-0023';

export const FEATURES = {
  'ct-shipment-0025': ctShipment0025Table,
  'unit-contract-0023': unitContract0023Table,
} as const;
