import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { BookingRow } from '../types';

const columns: Column<BookingRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof BookingRow & string)[] = ['id', 'name', 'category'];

export interface BookingTableProps {
  rows: BookingRow[];
  pageSize?: number;
  onSelect?: (row: BookingRow) => void;
}

export function BookingTable({ rows, pageSize = 10, onSelect }: BookingTableProps) {
  return <DataTable caption="Bookings" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
