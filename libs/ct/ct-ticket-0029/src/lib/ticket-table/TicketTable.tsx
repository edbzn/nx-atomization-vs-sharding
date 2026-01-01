import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { TicketRow } from '../types';

const columns: Column<TicketRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof TicketRow & string)[] = ['id', 'name', 'category'];

export interface TicketTableProps {
  rows: TicketRow[];
  pageSize?: number;
  onSelect?: (row: TicketRow) => void;
}

export function TicketTable({ rows, pageSize = 10, onSelect }: TicketTableProps) {
  return <DataTable caption="Tickets" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
