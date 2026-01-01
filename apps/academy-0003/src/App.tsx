import { Link, usePath } from './router';
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
  const detail = /^\/catalog\/([^/]+)$/.exec(path);
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
          <Link to="/catalog">Courses</Link>
          <Link to="/cart">Cart ({itemCount})</Link>
          <Link to="/board">Board</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </header>
      <main>{route(path)}</main>
      
    </>
  );
}
