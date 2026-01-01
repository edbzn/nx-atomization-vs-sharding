import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
import { CATALOG, type CatalogItem } from '../data';
import { navigate, useDocumentTitle } from '../router';

const columns: Column<CatalogItem>[] = [
  { key: 'id', header: 'Reference', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'category', header: 'Category', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'amount', header: 'Price', sortable: true, render: (row) => formatMoney(row.amount) },
];
const filterKeys: (keyof CatalogItem & string)[] = ['id', 'name', 'category'];

export function CatalogPage() {
  useDocumentTitle('Courses');
  return (
    <>
      <h1>Courses</h1>
      <DataTable caption="Courses" columns={columns} rows={CATALOG} filterKeys={filterKeys} onRowClick={(row) => navigate(`/catalog/${row.id}`)} />
    </>
  );
}
