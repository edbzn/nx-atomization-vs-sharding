import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { VehicleRow } from '../types';

const columns: Column<VehicleRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof VehicleRow & string)[] = ['id', 'name', 'category'];

export interface VehicleTableProps {
  rows: VehicleRow[];
  pageSize?: number;
  onSelect?: (row: VehicleRow) => void;
}

export function VehicleTable({ rows, pageSize = 10, onSelect }: VehicleTableProps) {
  return <DataTable caption="Vehicles" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
