import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { EmployeeRow } from '../types';

const columns: Column<EmployeeRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof EmployeeRow & string)[] = ['id', 'name', 'category'];

export interface EmployeeTableProps {
  rows: EmployeeRow[];
  pageSize?: number;
  onSelect?: (row: EmployeeRow) => void;
}

export function EmployeeTable({ rows, pageSize = 10, onSelect }: EmployeeTableProps) {
  return <DataTable caption="Employees" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
