import { useState } from 'react';
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
  if (!item) return <h1>Order not found</h1>;
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
          toast(`Added ${quantity} × ${item.name}`);
          setQuantity(1);
        }}
      >
        Add to cart
      </Button>
      <p>
        <Link to="/catalog">Back to orders</Link>
      </p>
    </>
  );
}
