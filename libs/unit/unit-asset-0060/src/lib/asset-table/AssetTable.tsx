import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { AssetRow } from '../types';

const columns: Column<AssetRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof AssetRow & string)[] = ['id', 'name', 'category'];

export interface AssetTableProps {
  rows: AssetRow[];
  pageSize?: number;
  onSelect?: (row: AssetRow) => void;
}

export function AssetTable({ rows, pageSize = 10, onSelect }: AssetTableProps) {
  return <DataTable caption="Assets" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
