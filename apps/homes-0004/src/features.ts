// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { BookingTable as ctBooking0062Table } from '@bench/ct-booking-0062';
import { BookingTable as ctBooking0074Table } from '@bench/ct-booking-0074';
import { ProductTable as ctProduct0076Table } from '@bench/ct-product-0076';
import { EmployeeTable as unitEmployee0022Table } from '@bench/unit-employee-0022';

export const FEATURES = {
  'ct-booking-0062': ctBooking0062Table,
  'ct-booking-0074': ctBooking0074Table,
  'ct-product-0076': ctProduct0076Table,
  'unit-employee-0022': unitEmployee0022Table,
} as const;
