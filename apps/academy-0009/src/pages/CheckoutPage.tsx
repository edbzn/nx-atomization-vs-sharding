import { Button, CheckboxField, SelectField, TextField, formatMoney, orderReference, pluralize, useForm, type FormRules } from '@bench/shared-ui';
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
  email: { label: 'Email', required: true, pattern: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, patternMessage: 'Enter a valid email address' },
  address: { label: 'Address', required: true, minLength: 5 },
  city: { label: 'City', required: true },
  postalCode: { label: 'Postal code', required: true, pattern: /^\d{4}$/, patternMessage: 'Postal code must be 4 digits' },
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
              reference: orderReference(`${v.fullName}|${v.email}|${v.postalCode}`),
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
      {lines.length > 0 ? <p>{lines.length} distinct courses</p> : null}
    </>
  );
}
