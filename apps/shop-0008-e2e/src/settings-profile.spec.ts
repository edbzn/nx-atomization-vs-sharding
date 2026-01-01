import { expect, test } from '@playwright/test';

test('updates and persists settings (5 changes)', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('textbox', { name: 'Display name' }).fill('Pia Bogaert');
  await page.getByRole('combobox', { name: 'Language' }).selectOption('Deutsch');
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await page.getByRole('combobox', { name: 'Profile visibility' }).selectOption('Team');
  await page.getByRole('tab', { name: 'Profile' }).click();
  await page.getByRole('combobox', { name: 'Language' }).selectOption('English');
  await page.getByRole('combobox', { name: 'Language' }).selectOption('Français');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('status').last()).toHaveText('Settings saved');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Display name' })).toHaveValue('Pia Bogaert');
  await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('Français');
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await expect(page.getByRole('checkbox', { name: 'Order updates' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Weekly digest' })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Product news' })).not.toBeChecked();
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await expect(page.getByRole('combobox', { name: 'Profile visibility' })).toHaveValue('Team');
  await expect(page.getByRole('checkbox', { name: 'Show me in search' })).toBeChecked();
});

test('updates and persists settings (5 changes) #2', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('textbox', { name: 'Display name' }).fill('Oscar De Smet');
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await page.getByRole('checkbox', { name: 'Product news' }).check();
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await page.getByRole('checkbox', { name: 'Show me in search' }).uncheck();
  await page.getByRole('combobox', { name: 'Profile visibility' }).selectOption('Private');
  await page.getByRole('tab', { name: 'Profile' }).click();
  await page.getByRole('textbox', { name: 'Display name' }).fill('Sara Lemmens');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('status').last()).toHaveText('Settings saved');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Display name' })).toHaveValue('Sara Lemmens');
  await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('English');
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await expect(page.getByRole('checkbox', { name: 'Order updates' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Weekly digest' })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Product news' })).toBeChecked();
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await expect(page.getByRole('combobox', { name: 'Profile visibility' })).toHaveValue('Private');
  await expect(page.getByRole('checkbox', { name: 'Show me in search' })).not.toBeChecked();
});

test('updates and persists settings (1 changes)', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Settings');
  await page.getByRole('combobox', { name: 'Language' }).selectOption('Français');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('status').last()).toHaveText('Settings saved');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Display name' })).toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Language' })).toHaveValue('Français');
  await page.getByRole('tab', { name: 'Notifications' }).click();
  await expect(page.getByRole('checkbox', { name: 'Order updates' })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Weekly digest' })).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Product news' })).not.toBeChecked();
  await page.getByRole('tab', { name: 'Privacy' }).click();
  await expect(page.getByRole('combobox', { name: 'Profile visibility' })).toHaveValue('Team');
  await expect(page.getByRole('checkbox', { name: 'Show me in search' })).toBeChecked();
});
