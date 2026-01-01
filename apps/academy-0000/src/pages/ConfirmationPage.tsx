import { formatMoney, pluralize } from '@bench/shared-ui';
import { useCart } from '../cart';
import { Link, useDocumentTitle } from '../router';

export function ConfirmationPage() {
  const { lastOrder } = useCart();
  useDocumentTitle('Order confirmed');
  if (!lastOrder) {
    return (
      <>
        <h1>No order yet</h1>
        <Link to="/catalog">Browse courses</Link>
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
