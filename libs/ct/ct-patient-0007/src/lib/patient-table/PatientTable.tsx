import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { PatientRow } from '../types';

const columns: Column<PatientRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof PatientRow & string)[] = ['id', 'name', 'category'];

export interface PatientTableProps {
  rows: PatientRow[];
  pageSize?: number;
  onSelect?: (row: PatientRow) => void;
}

export function PatientTable({ rows, pageSize = 10, onSelect }: PatientTableProps) {
  return <DataTable caption="Patients" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
