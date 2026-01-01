import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { ProductRow } from '../types';

const columns: Column<ProductRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof ProductRow & string)[] = ['id', 'name', 'category'];

export interface ProductTableProps {
  rows: ProductRow[];
  pageSize?: number;
  onSelect?: (row: ProductRow) => void;
}

export function ProductTable({ rows, pageSize = 10, onSelect }: ProductTableProps) {
  return <DataTable caption="Products" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
