import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import type { CampaignRow } from '../types';

const columns: Column<CampaignRow>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatMoney(row.amount) },
];

const filterKeys: (keyof CampaignRow & string)[] = ['id', 'name', 'category'];

export interface CampaignTableProps {
  rows: CampaignRow[];
  pageSize?: number;
  onSelect?: (row: CampaignRow) => void;
}

export function CampaignTable({ rows, pageSize = 10, onSelect }: CampaignTableProps) {
  return <DataTable caption="Campaigns" columns={columns} rows={rows} filterKeys={filterKeys} pageSize={pageSize} onRowClick={onSelect} />;
}
