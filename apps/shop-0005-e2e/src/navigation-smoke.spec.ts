import { expect, test } from '@playwright/test';

test('navigates between pages (5 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shop Admin');
  await expect(page.getByTestId('catalog-size')).toHaveText('140 orders');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Orders' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Orders');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shop Admin');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Orders');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Board' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Board');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Bulk Bundle', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('ORD-0065');
});

test('navigates between pages (7 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shop Admin');
  await expect(page.getByTestId('catalog-size')).toHaveText('140 orders');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shop Admin');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Orders' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Orders');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shop Admin');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Orders');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shop Admin');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Orders' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Orders');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shop Admin');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Bulk Hamper', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('ORD-0022');
});

test('navigates between pages (4 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shop Admin');
  await expect(page.getByTestId('catalog-size')).toHaveText('140 orders');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: /^Cart/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cart');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: /^Cart/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cart');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Bulk Hamper', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('ORD-0022');
});
