import { Card, formatMoney } from '@bench/shared-ui';
import { CATALOG, CATEGORIES } from '../data';
import { Link, useDocumentTitle } from '../router';

const featured = [...CATALOG].sort((a, b) => b.amount - a.amount).slice(0, 3);

export function HomePage() {
  useDocumentTitle('Shop Admin');
  return (
    <>
      <h1>Shop Admin</h1>
      <div className="cards">
        <Card title="Catalog">
          <p data-testid="catalog-size">{CATALOG.length} orders</p>
          <p>{CATEGORIES.length} categories</p>
        </Card>
        <Card title="Featured">
          <ul>
            {featured.map((item) => (
              <li key={item.id}>
                <Link to={`/catalog/${item.id}`}>{item.name}</Link> {formatMoney(item.amount)}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
