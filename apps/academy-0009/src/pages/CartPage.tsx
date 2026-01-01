import { Button, formatMoney } from '@bench/shared-ui';
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
              <th scope="col">Course</th>
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
                  <Button variant="ghost" aria-label={`Remove ${l.item.id}`} onClick={() => remove(l.item.id)}>
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
