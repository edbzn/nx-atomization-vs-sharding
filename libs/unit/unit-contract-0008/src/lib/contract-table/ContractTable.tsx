import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { ContractRow } from '../types';

const columns: Column<ContractRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof ContractRow & string)[] = ['id', 'name', 'category'];

export interface ContractTableProps {
  rows: ContractRow[];
  pageSize?: number;
  onSelect?: (row: ContractRow) => void;
}

export function ContractTable({ rows, pageSize = 10, onSelect }: ContractTableProps) {
  return <DataTable caption="Contracts" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
