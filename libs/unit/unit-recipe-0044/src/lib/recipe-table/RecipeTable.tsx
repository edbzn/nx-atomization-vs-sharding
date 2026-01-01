import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { RecipeRow } from '../types';

const columns: Column<RecipeRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof RecipeRow & string)[] = ['id', 'name', 'category'];

export interface RecipeTableProps {
  rows: RecipeRow[];
  pageSize?: number;
  onSelect?: (row: RecipeRow) => void;
}

export function RecipeTable({ rows, pageSize = 10, onSelect }: RecipeTableProps) {
  return <DataTable caption="Recipes" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
