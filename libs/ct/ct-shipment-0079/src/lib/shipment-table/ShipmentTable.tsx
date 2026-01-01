import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { ShipmentRow } from '../types';

const columns: Column<ShipmentRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof ShipmentRow & string)[] = ['id', 'name', 'category'];

export interface ShipmentTableProps {
  rows: ShipmentRow[];
  pageSize?: number;
  onSelect?: (row: ShipmentRow) => void;
}

export function ShipmentTable({ rows, pageSize = 10, onSelect }: ShipmentTableProps) {
  return <DataTable caption="Shipments" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
