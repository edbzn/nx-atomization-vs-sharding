import { expect, test } from '@playwright/test';

test('updates and persists settings (5 changes)', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('textbox', { name: 'Display name' }).fill('Cas Cools');
  await page.getByRole('combobox', { name: 'Language' }).selectOption('Français');
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await page.getByRole('combobox', { name: 'Profile visibility' }).selectOption('Team');
  await page.getByRole('tab', { name: 'Profile' }).click();
  await page.getByRole('combobox', { name: 'Language' }).selectOption('Deutsch');
  await page.getByRole('combobox', { name: 'Language' }).selectOption('Nederlands');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('status').last()).toHaveText('Settings saved');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Display name' })).toHaveValue('Cas Cools');
  await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('Nederlands');
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await expect(page.getByRole('checkbox', { name: 'Order updates' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Weekly digest' })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Product news' })).not.toBeChecked();
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await expect(page.getByRole('combobox', { name: 'Profile visibility' })).toHaveValue('Team');
  await expect(page.getByRole('checkbox', { name: 'Show me in search' })).toBeChecked();
});

test('updates and persists settings (4 changes)', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('combobox', { name: 'Language' }).selectOption('Français');
  await page.getByRole('combobox', { name: 'Language' }).selectOption('Deutsch');
  await page.getByRole('textbox', { name: 'Display name' }).fill('Bea Hendrickx');
  await page.getByRole('textbox', { name: 'Display name' }).fill('Bea De Smet');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('status').last()).toHaveText('Settings saved');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Display name' })).toHaveValue('Bea De Smet');
  await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('Deutsch');
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await expect(page.getByRole('checkbox', { name: 'Order updates' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Weekly digest' })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Product news' })).not.toBeChecked();
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await expect(page.getByRole('combobox', { name: 'Profile visibility' })).toHaveValue('Team');
  await expect(page.getByRole('checkbox', { name: 'Show me in search' })).toBeChecked();
});

test('updates and persists settings (1 changes)', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('textbox', { name: 'Display name' }).fill('Oscar Van Damme');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('status').last()).toHaveText('Settings saved');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Display name' })).toHaveValue('Oscar Van Damme');
  await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('English');
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await expect(page.getByRole('checkbox', { name: 'Order updates' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Weekly digest' })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Product news' })).not.toBeChecked();
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await expect(page.getByRole('combobox', { name: 'Profile visibility' })).toHaveValue('Team');
  await expect(page.getByRole('checkbox', { name: 'Show me in search' })).toBeChecked();
});
