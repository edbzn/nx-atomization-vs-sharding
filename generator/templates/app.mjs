// Vite React applications (apps/<name>) exercised by the Playwright e2e projects.
// Pages: home, catalog (DataTable), detail (+cart), cart, checkout (form), confirmation,
// board (localStorage-persisted kanban) and settings (tabs, persisted).
// `touched` is the "partial" change for the app: a small, behaviour-preserving feature.

import { rowsLiteral, tsString } from '../lib/domain.mjs';

function json(o) {
  return JSON.stringify(o, null, 2) + '\n';
}

export const CHECKOUT_RULES = {
  fullName: { label: 'Full name', required: true, minLength: 3 },
  email: { label: 'Email', required: true, pattern: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, patternMessage: 'Enter a valid email address' },
  address: { label: 'Address', required: true, minLength: 5 },
  city: { label: 'City', required: true },
  postalCode: { label: 'Postal code', required: true, pattern: /^\d{4}$/, patternMessage: 'Postal code must be 4 digits' },
  delivery: { label: 'Delivery', required: true },
  terms: { label: 'Terms acceptance', required: true },
};

export const DELIVERY = ['Standard', 'Express', 'Pickup'];
export const DELIVERY_FEES = { Standard: 495, Express: 1295, Pickup: 0 };
export const LANGUAGES = ['English', 'Nederlands', 'Français', 'Deutsch'];
export const VISIBILITY = ['Public', 'Team', 'Private'];
export const NOTIFICATIONS = ['Order updates', 'Weekly digest', 'Product news'];

export function appFiles({ name, title, domain, rows, touched = false }) {
  const root = `apps/${name}`;
  const files = {};
  const plural = domain.plural;
  const entityLower = domain.entity.toLowerCase();

  files[`${root}/package.json`] = json({
    name: `@bench/${name}`,
    version: '0.0.0',
    private: true,
    dependencies: { '@bench/shared-ui': 'workspace:*' },
  });
  files[`${root}/project.json`] = json({
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    name,
    sourceRoot: `${root}/src`,
    projectType: 'application',
    tags: ['type:app'],
    targets: {
      build: {
        command: 'vite build',
        options: { cwd: '{projectRoot}' },
        cache: true,
        inputs: ['production', '^production', { externalDependencies: ['vite'] }],
        outputs: ['{projectRoot}/dist'],
      },
    },
  });
  files[`${root}/tsconfig.json`] = json({
    extends: '../../tsconfig.base.json',
    compilerOptions: { types: ['vite/client', 'node'] },
    include: ['src/**/*.ts', 'src/**/*.tsx', 'vite.config.ts'],
  });
  files[`${root}/vite.config.ts`] = `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  logLevel: 'warn',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    reportCompressedSize: false,
  },
});
`;
  files[`${root}/index.html`] = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  files[`${root}/src/main.tsx`] = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from '@bench/shared-ui';
import { App } from './App';
import { CartProvider } from './cart';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ToastProvider>
  </StrictMode>,
);
`;
  files[`${root}/src/styles.css`] = `:root { font-family: system-ui, sans-serif; color: #1f2933; }
body { margin: 0; }
header nav { display: flex; gap: 1rem; padding: 0.75rem 1.5rem; background: #102a43; }
header nav a { color: #f0f4f8; text-decoration: none; }
header nav a[aria-current='page'] { text-decoration: underline; }
main { padding: 1.5rem; max-width: 960px; margin: 0 auto; }
table { width: 100%; border-collapse: collapse; }
td, th { padding: 0.25rem 0.5rem; border-bottom: 1px solid #d9e2ec; text-align: left; }
tbody tr { cursor: pointer; }
.field { display: flex; flex-direction: column; margin-bottom: 0.75rem; }
.field-error { color: #ba2525; margin: 0.25rem 0 0; }
.btn { padding: 0.35rem 0.8rem; border-radius: 4px; border: 1px solid #334e68; }
.btn-primary { background: #334e68; color: white; }
.board-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.toasts { position: fixed; bottom: 1rem; right: 1rem; list-style: none; }
`;
  files[`${root}/src/data.ts`] = `export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  /** Price in cents. */
  amount: number;
}

export const CATALOG: CatalogItem[] = ${rowsLiteral(rows, '')};

export const CATEGORIES = [${domain.categories.map(tsString).join(', ')}] as const;
`;
  files[`${root}/src/router.tsx`] = `import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener('popstate', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('popstate', cb);
  };
};

export function navigate(to: string) {
  if (to === window.location.pathname) return;
  window.history.pushState(null, '', to);
  listeners.forEach((l) => l());
}

export function usePath() {
  return useSyncExternalStore(subscribe, () => window.location.pathname);
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function Link({ to, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const path = usePath();
  return (
    <a
      href={to}
      aria-current={path === to ? 'page' : undefined}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    />
  );
}
`;
  files[`${root}/src/cart.tsx`] = `import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CatalogItem } from './data';

export interface CartLine {
  item: CatalogItem;
  quantity: number;
}

export interface PlacedOrder {
  reference: string;
  name: string;
  items: number;
  total: number;
}

interface CartState {
  lines: CartLine[];
  add: (item: CatalogItem, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
  lastOrder: PlacedOrder | null;
  setLastOrder: (order: PlacedOrder) => void;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  const value = useMemo<CartState>(() => {
    const add = (item: CatalogItem, quantity: number) =>
      setLines((prev) => {
        const existing = prev.find((l) => l.item.id === item.id);
        if (existing) return prev.map((l) => (l.item.id === item.id ? { ...l, quantity: l.quantity + quantity } : l));
        return [...prev, { item, quantity }];
      });
    return {
      lines,
      add,
      remove: (id) => setLines((prev) => prev.filter((l) => l.item.id !== id)),
      clear: () => setLines([]),
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.quantity * l.item.amount, 0),
      lastOrder,
      setLastOrder,
    };
  }, [lines, lastOrder]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
`;
  files[`${root}/src/App.tsx`] = `import { Link, usePath } from './router';
import { useCart } from './cart';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { DetailPage } from './pages/DetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { BoardPage } from './pages/BoardPage';
import { SettingsPage } from './pages/SettingsPage';

function NotFound() {
  return <h1>Page not found</h1>;
}

function route(path: string) {
  if (path === '/') return <HomePage />;
  if (path === '/catalog') return <CatalogPage />;
  const detail = /^\\/catalog\\/([^/]+)$/.exec(path);
  if (detail) return <DetailPage id={decodeURIComponent(detail[1])} />;
  if (path === '/cart') return <CartPage />;
  if (path === '/checkout') return <CheckoutPage />;
  if (path === '/confirmation') return <ConfirmationPage />;
  if (path === '/board') return <BoardPage />;
  if (path === '/settings') return <SettingsPage />;
  return <NotFound />;
}

export function App() {
  const path = usePath();
  const { itemCount } = useCart();
  return (
    <>
      <header>
        <nav aria-label="Main">
          <Link to="/">Home</Link>
          <Link to="/catalog">${plural}</Link>
          <Link to="/cart">Cart ({itemCount})</Link>
          <Link to="/board">Board</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </header>
      <main>{route(path)}</main>
      ${touched ? `<footer data-testid="app-footer">
        <small>${title} · {new Date().getFullYear()}</small>
      </footer>` : ''}
    </>
  );
}
`;
  files[`${root}/src/pages/HomePage.tsx`] = `import { Card, formatMoney } from '@bench/shared-ui';
import { CATALOG, CATEGORIES } from '../data';
import { Link, useDocumentTitle } from '../router';

const featured = [...CATALOG].sort((a, b) => b.amount - a.amount).slice(0, 3);

export function HomePage() {
  useDocumentTitle(${tsString(title)});
  return (
    <>
      <h1>${title}</h1>
      <div className="cards">
        <Card title="Catalog">
          <p data-testid="catalog-size">{CATALOG.length} ${plural.toLowerCase()}</p>
          <p>{CATEGORIES.length} categories</p>
        </Card>
        <Card title="Featured">
          <ul>
            {featured.map((item) => (
              <li key={item.id}>
                <Link to={\`/catalog/\${item.id}\`}>{item.name}</Link> {formatMoney(item.amount)}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
`;
  files[`${root}/src/pages/CatalogPage.tsx`] = `import { Badge, DataTable, formatMoney, type Column } from '@bench/shared-ui';
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
  useDocumentTitle(${tsString(plural)});
  return (
    <>
      <h1>${plural}</h1>
      <DataTable caption=${JSON.stringify(plural)} columns={columns} rows={CATALOG} filterKeys={filterKeys} onRowClick={(row) => navigate(\`/catalog/\${row.id}\`)} />
    </>
  );
}
`;
  files[`${root}/src/pages/DetailPage.tsx`] = `import { useState } from 'react';
import { Button, formatMoney, useToast } from '@bench/shared-ui';
import { CATALOG } from '../data';
import { useCart } from '../cart';
import { Link, useDocumentTitle } from '../router';

export function DetailPage({ id }: { id: string }) {
  const item = CATALOG.find((i) => i.id === id);
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();
  const toast = useToast();
  useDocumentTitle(item ? item.name : 'Not found');
  if (!item) return <h1>${domain.entity} not found</h1>;
  return (
    <>
      <h1>{item.name}</h1>
      <dl>
        <dt>Reference</dt>
        <dd data-testid="detail-id">{item.id}</dd>
        <dt>Category</dt>
        <dd>{item.category}</dd>
        <dt>Price</dt>
        <dd data-testid="detail-price">{formatMoney(item.amount)}</dd>
      </dl>
      <div className="quantity">
        <Button variant="secondary" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((q) => q - 1)}>
          -
        </Button>
        <output data-testid="quantity">{quantity}</output>
        <Button variant="secondary" aria-label="Increase quantity" disabled={quantity >= 20} onClick={() => setQuantity((q) => q + 1)}>
          +
        </Button>
      </div>
      <Button
        onClick={() => {
          add(item, quantity);
          toast(\`Added \${quantity} × \${item.name}\`);
          setQuantity(1);
        }}
      >
        Add to cart
      </Button>
      <p>
        <Link to="/catalog">Back to ${plural.toLowerCase()}</Link>
      </p>
    </>
  );
}
`;
  files[`${root}/src/pages/CartPage.tsx`] = `import { Button, formatMoney } from '@bench/shared-ui';
import { useCart } from '../cart';
import { Link, useDocumentTitle } from '../router';

export function CartPage() {
  const { lines, remove, subtotal } = useCart();
  useDocumentTitle('Cart');
  return (
    <>
      <h1>Cart</h1>
      {lines.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <table>
          <caption>Cart lines</caption>
          <thead>
            <tr>
              <th scope="col">${domain.entity}</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.item.id} data-testid="cart-line">
                <td>{l.item.name}</td>
                <td data-testid="line-quantity">{l.quantity}</td>
                <td data-testid="line-total">{formatMoney(l.quantity * l.item.amount)}</td>
                <td>
                  <Button variant="ghost" aria-label={\`Remove \${l.item.id}\`} onClick={() => remove(l.item.id)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p data-testid="cart-subtotal">Subtotal: {formatMoney(subtotal)}</p>
      <Link to="/checkout">Proceed to checkout</Link>
    </>
  );
}
`;
  files[`${root}/src/pages/CheckoutPage.tsx`] = `import { Button, CheckboxField, SelectField, TextField, formatMoney, orderReference, pluralize, useForm, type FormRules } from '@bench/shared-ui';
import { useCart } from '../cart';
import { navigate, useDocumentTitle } from '../router';

interface CheckoutValues extends Record<string, unknown> {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  delivery: string;
  terms: string;
}

const DELIVERY = ['Standard', 'Express', 'Pickup'] as const;
const FEES: Record<string, number> = { Standard: 495, Express: 1295, Pickup: 0 };

const rules: FormRules<CheckoutValues> = {
  fullName: { label: 'Full name', required: true, minLength: 3 },
  email: { label: 'Email', required: true, pattern: /^[^\\s@]+@[^\\s@]+\\.[a-z]{2,}$/i, patternMessage: 'Enter a valid email address' },
  address: { label: 'Address', required: true, minLength: 5 },
  city: { label: 'City', required: true },
  postalCode: { label: 'Postal code', required: true, pattern: /^\\d{4}$/, patternMessage: 'Postal code must be 4 digits' },
  delivery: { label: 'Delivery', required: true },
  terms: { label: 'Terms acceptance', required: true },
};

const initial: CheckoutValues = { fullName: '', email: '', address: '', city: '', postalCode: '', delivery: '', terms: '' };

export function CheckoutPage() {
  const { lines, itemCount, subtotal, clear, setLastOrder } = useCart();
  const { values, errors, setValue, handleSubmit } = useForm<CheckoutValues>(initial, rules);
  useDocumentTitle('Checkout');
  const fee = values.delivery ? FEES[values.delivery] : 0;
  const errorCount = Object.keys(errors).length;
  return (
    <>
      <h1>Checkout</h1>
      <p data-testid="checkout-summary">
        {pluralize(itemCount, 'item')} · {formatMoney(subtotal + fee)}
      </p>
      <form
        aria-label="Checkout"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit((v) => {
            setLastOrder({
              reference: orderReference(\`\${v.fullName}|\${v.email}|\${v.postalCode}\`),
              name: v.fullName,
              items: itemCount,
              total: subtotal + FEES[v.delivery],
            });
            clear();
            navigate('/confirmation');
          });
        }}
      >
        <TextField label="Full name" name="fullName" value={values.fullName} error={errors.fullName} onChange={(v) => setValue('fullName', v)} />
        <TextField label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={(v) => setValue('email', v)} />
        <TextField label="Address" name="address" value={values.address} error={errors.address} onChange={(v) => setValue('address', v)} />
        <TextField label="City" name="city" value={values.city} error={errors.city} onChange={(v) => setValue('city', v)} />
        <TextField label="Postal code" name="postalCode" value={values.postalCode} error={errors.postalCode} onChange={(v) => setValue('postalCode', v)} />
        <SelectField label="Delivery" name="delivery" options={DELIVERY} value={values.delivery} error={errors.delivery} onChange={(v) => setValue('delivery', v)} />
        <CheckboxField label="I accept the terms" name="terms" checked={values.terms === 'accepted'} onChange={(c) => setValue('terms', c ? 'accepted' : '')} />
        {errors.terms ? (
          <p role="alert" className="field-error">
            {errors.terms}
          </p>
        ) : null}
        {errorCount > 0 ? <p data-testid="error-summary">{pluralize(errorCount, 'error')}</p> : null}
        <Button type="submit">Place order</Button>
      </form>
      {lines.length > 0 ? <p>{lines.length} distinct ${plural.toLowerCase()}</p> : null}
    </>
  );
}
`;
  files[`${root}/src/pages/ConfirmationPage.tsx`] = `import { formatMoney, pluralize } from '@bench/shared-ui';
import { useCart } from '../cart';
import { Link, useDocumentTitle } from '../router';

export function ConfirmationPage() {
  const { lastOrder } = useCart();
  useDocumentTitle('Order confirmed');
  if (!lastOrder) {
    return (
      <>
        <h1>No order yet</h1>
        <Link to="/catalog">Browse ${plural.toLowerCase()}</Link>
      </>
    );
  }
  return (
    <>
      <h1>Thank you, {lastOrder.name}</h1>
      <p data-testid="order-reference">{lastOrder.reference}</p>
      <p data-testid="order-total">
        {pluralize(lastOrder.items, 'item')} · {formatMoney(lastOrder.total)}
      </p>
    </>
  );
}
`;
  files[`${root}/src/pages/BoardPage.tsx`] = `import { useEffect, useMemo, useState } from 'react';
import { Button, TextField } from '@bench/shared-ui';
import { useDocumentTitle } from '../router';

type Status = 'todo' | 'doing' | 'done';
interface Card {
  id: number;
  title: string;
  status: Status;
}

const STORAGE_KEY = '${name}.board';
const COLUMNS: { status: Status; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'doing', label: 'In progress' },
  { status: 'done', label: 'Done' },
];
const NEXT: Record<Status, { verb: string; to: Status }> = {
  todo: { verb: 'Start', to: 'doing' },
  doing: { verb: 'Finish', to: 'done' },
  done: { verb: 'Reopen', to: 'todo' },
};

function load(): Card[] {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as Card[];
  } catch {
    return [];
  }
}

export function BoardPage() {
  useDocumentTitle('Board');
  const [cards, setCards] = useState<Card[]>(load);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('');
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);
  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? cards.filter((c) => c.title.toLowerCase().includes(q)) : cards;
  }, [cards, filter]);
  const add = () => {
    const title = draft.trim();
    setDraft('');
    if (!title || cards.some((c) => c.title === title)) return;
    setCards((prev) => [...prev, { id: (prev.at(-1)?.id ?? 0) + 1, title, status: 'todo' }]);
  };
  return (
    <>
      <h1>Board</h1>
      <TextField label="New card" name="new-card" value={draft} onChange={setDraft} onEnter={add} />
      <TextField label="Filter cards" name="card-filter" type="search" value={filter} onChange={setFilter} />
      <p data-testid="board-summary">
        {cards.filter((c) => c.status === 'done').length} of {cards.length} done
      </p>
      <div className="board-columns">
        {COLUMNS.map((col) => {
          const items = visible.filter((c) => c.status === col.status);
          return (
            <section key={col.status} aria-label={col.label} data-testid={\`column-\${col.status}\`}>
              <h2>
                {col.label} ({items.length})
              </h2>
              <ul>
                {items.map((c) => (
                  <li key={c.id} data-testid="card">
                    {c.title}
                    <Button variant="secondary" aria-label={\`\${NEXT[c.status].verb} \${c.title}\`} onClick={() => setCards((prev) => prev.map((p) => (p.id === c.id ? { ...p, status: NEXT[c.status].to } : p)))}>
                      {NEXT[c.status].verb}
                    </Button>
                    <Button variant="danger" aria-label={\`Delete \${c.title}\`} onClick={() => setCards((prev) => prev.filter((p) => p.id !== c.id))}>
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
`;
  files[`${root}/src/pages/SettingsPage.tsx`] = `import { useState } from 'react';
import { Button, CheckboxField, SelectField, Tabs, TextField, useToast } from '@bench/shared-ui';
import { useDocumentTitle } from '../router';

interface Settings {
  displayName: string;
  language: string;
  notifications: Record<string, boolean>;
  visibility: string;
  searchable: boolean;
}

const STORAGE_KEY = '${name}.settings';
const LANGUAGES = [${['English', 'Nederlands', 'Français', 'Deutsch'].map(tsString).join(', ')}] as const;
const VISIBILITY = ['Public', 'Team', 'Private'] as const;
const NOTIFICATIONS = ['Order updates', 'Weekly digest', 'Product news'] as const;
const DEFAULTS: Settings = {
  displayName: '',
  language: 'English',
  notifications: { 'Order updates': true, 'Weekly digest': false, 'Product news': false },
  visibility: 'Team',
  searchable: true,
};

function load(): Settings {
  try {
    return { ...DEFAULTS, ...(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<Settings>) };
  } catch {
    return DEFAULTS;
  }
}

export function SettingsPage() {
  useDocumentTitle('Settings');
  const [settings, setSettings] = useState<Settings>(load);
  const toast = useToast();
  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  return (
    <>
      <h1>Settings</h1>
      <Tabs
        tabs={[
          {
            id: 'profile',
            label: 'Profile',
            content: (
              <>
                <TextField label="Display name" name="displayName" value={settings.displayName} onChange={(v) => update({ displayName: v })} />
                <SelectField label="Language" name="language" options={LANGUAGES} value={settings.language} onChange={(v) => update({ language: v })} />
              </>
            ),
          },
          {
            id: 'notifications',
            label: 'Notifications',
            content: (
              <>
                {NOTIFICATIONS.map((n) => (
                  <CheckboxField key={n} label={n} checked={!!settings.notifications[n]} onChange={(c) => update({ notifications: { ...settings.notifications, [n]: c } })} />
                ))}
              </>
            ),
          },
          {
            id: 'privacy',
            label: 'Privacy',
            content: (
              <>
                <SelectField label="Profile visibility" name="visibility" options={VISIBILITY} value={settings.visibility} onChange={(v) => update({ visibility: v })} />
                <CheckboxField label="Show me in search" checked={settings.searchable} onChange={(c) => update({ searchable: c })} />
              </>
            ),
          },
        ]}
      />
      <Button
        onClick={() => {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
          toast('Settings saved');
        }}
      >
        Save settings
      </Button>
    </>
  );
}
`;
  void entityLower;
  return { root, files };
}
