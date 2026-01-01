import { expect, test } from '@playwright/test';

test('navigates between pages (9 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Academy Portal');
  await expect(page.getByTestId('catalog-size')).toHaveText('64 courses');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Board' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Board');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Academy Portal');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: /^Cart/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cart');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: /^Cart/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cart');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Academy Portal');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: /^Cart/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cart');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Board' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Board');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Courses' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Courses');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Visual Chemistry', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('CRS-0058');
});

test('navigates between pages (5 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Academy Portal');
  await expect(page.getByTestId('catalog-size')).toHaveText('64 courses');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Board' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Board');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Courses' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Courses');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Board');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Board' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Board');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Courses' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Courses');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Applied Spanish', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('CRS-0053');
});

test('navigates between pages (1 hops)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Academy Portal');
  await expect(page.getByTestId('catalog-size')).toHaveText('64 courses');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Board' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Board');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Applied Spanish', exact: true }).first().click();
  await expect(page.getByTestId('detail-id')).toHaveText('CRS-0053');
});
