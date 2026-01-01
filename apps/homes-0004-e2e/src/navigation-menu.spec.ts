import { expect, test } from '@playwright/test';

test('navigates between pages (9 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await expect(page.getByTestId('catalog-size')).toHaveText('96 listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Listings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: /^Cart/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cart');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Furnished Bungalow', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('LST-0073');
});

test('navigates between pages (7 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await expect(page.getByTestId('catalog-size')).toHaveText('96 listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Listings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Listings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Listings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Listings');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Central Flat', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('LST-0050');
});

test('navigates between pages (4 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await expect(page.getByTestId('catalog-size')).toHaveText('96 listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Central Flat', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('LST-0050');
});

test('navigates between pages (5 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await expect(page.getByTestId('catalog-size')).toHaveText('96 listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: /^Cart/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cart');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Board' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Board');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Central Flat', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('LST-0050');
});

test('navigates between pages (3 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await expect(page.getByTestId('catalog-size')).toHaveText('96 listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Homes Finder');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: /^Cart/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cart');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Listings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Listings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Spacious Duplex', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('LST-0052');
});
