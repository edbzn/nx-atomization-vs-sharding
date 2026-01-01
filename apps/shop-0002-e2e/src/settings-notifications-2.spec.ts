import { expect, test } from '@playwright/test';

test('updates and persists settings (7 changes)', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('textbox', { name: 'Display name' }).fill('Victor Coppens');
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await page.getByRole('checkbox', { name: 'Show me in search' }).uncheck();
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await page.getByRole('checkbox', { name: 'Weekly digest' }).check();
  await page.getByRole('tab', { name: 'Profile' }).click();
  await page.getByRole('textbox', { name: 'Display name' }).fill('Tom De Smet');
  await page.getByRole('textbox', { name: 'Display name' }).fill('Pia Bogaert');
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await page.getByRole('checkbox', { name: 'Show me in search' }).check();
  await page.getByRole('combobox', { name: 'Profile visibility' }).selectOption('Private');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('status').last()).toHaveText('Settings saved');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Display name' })).toHaveValue('Pia Bogaert');
  await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('English');
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await expect(page.getByRole('checkbox', { name: 'Order updates' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Weekly digest' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Product news' })).not.toBeChecked();
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await expect(page.getByRole('combobox', { name: 'Profile visibility' })).toHaveValue('Private');
  await expect(page.getByRole('checkbox', { name: 'Show me in search' })).toBeChecked();
});

test('updates and persists settings (2 changes)', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('textbox', { name: 'Display name' }).fill('Bea Cools');
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await page.getByRole('checkbox', { name: 'Product news' }).check();
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('status').last()).toHaveText('Settings saved');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Display name' })).toHaveValue('Bea Cools');
  await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('English');
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await expect(page.getByRole('checkbox', { name: 'Order updates' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Weekly digest' })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Product news' })).toBeChecked();
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await expect(page.getByRole('combobox', { name: 'Profile visibility' })).toHaveValue('Team');
  await expect(page.getByRole('checkbox', { name: 'Show me in search' })).toBeChecked();
});
