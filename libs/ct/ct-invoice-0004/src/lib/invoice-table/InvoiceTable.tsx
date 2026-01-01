import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { InvoiceRow } from '../types';

const columns: Column<InvoiceRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof InvoiceRow & string)[] = ['id', 'name', 'category'];

export interface InvoiceTableProps {
  rows: InvoiceRow[];
  pageSize?: number;
  onSelect?: (row: InvoiceRow) => void;
}

export function InvoiceTable({ rows, pageSize = 10, onSelect }: InvoiceTableProps) {
  return <DataTable caption="Invoices" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
