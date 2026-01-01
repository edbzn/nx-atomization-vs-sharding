// Feature libraries this app integrates (shapes the project graph; not imported by main.tsx).
import { InvoiceTable as ctInvoice0002Table } from '@bench/ct-invoice-0002';
import { ProductTable as ctProduct0000Table } from '@bench/ct-product-0000';
import { TicketTable as ctTicket0004Table } from '@bench/ct-ticket-0004';
import { ContractTable as unitContract0008Table } from '@bench/unit-contract-0008';

export const FEATURES = {
  'ct-invoice-0002': ctInvoice0002Table,
  'ct-product-0000': ctProduct0000Table,
  'ct-ticket-0004': ctTicket0004Table,
  'unit-contract-0008': unitContract0008Table,
} as const;
