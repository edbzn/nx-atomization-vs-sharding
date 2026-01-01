import { useState } from 'react';
import { Button, CheckboxField, SelectField, Tabs, TextField, useToast } from '@bench/shared-ui';
import { useDocumentTitle } from '../router';

interface Settings {
  displayName: string;
  language: string;
  notifications: Record<string, boolean>;
  visibility: string;
  searchable: boolean;
}

const STORAGE_KEY = 'academy-0006.settings';
const LANGUAGES = ['English', 'Nederlands', 'Français', 'Deutsch'] as const;
const VISIBILITY = ['Public', 'Team', 'Private'] as const;
const NOTIFICATIONS = ['Order updates', 'Weekly digest', 'Product news'] as const;
const DEFAULTS: Settings = {
  displayName: '',
  language: 'English',
  notifications: { 'Order updates': true, 'Weekly digest': false, 'Product news': false },
  visibility: 'Team',
  searchable: true,
};

function load(): Settings {
  try {
    return { ...DEFAULTS, ...(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<Settings>) };
  } catch {
    return DEFAULTS;
  }
}

export function SettingsPage() {
  useDocumentTitle('Settings');
  const [settings, setSettings] = useState<Settings>(load);
  const toast = useToast();
  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  return (
    <>
      <h1>Settings</h1>
      <Tabs
        tabs={[
          {
            id: 'profile',
            label: 'Profile',
            content: (
              <>
                <TextField label="Display name" name="displayName" value={settings.displayName} onChange={(v) => update({ displayName: v })} />
                <SelectField label="Language" name="language" options={LANGUAGES} value={settings.language} onChange={(v) => update({ language: v })} />
              </>
            ),
          },
          {
            id: 'notifications',
            label: 'Notifications',
            content: (
              <>
                {NOTIFICATIONS.map((n) => (
                  <CheckboxField key={n} label={n} checked={!!settings.notifications[n]} onChange={(c) => update({ notifications: { ...settings.notifications, [n]: c } })} />
                ))}
              </>
            ),
          },
          {
            id: 'privacy',
            label: 'Privacy',
            content: (
              <>
                <SelectField label="Profile visibility" name="visibility" options={VISIBILITY} value={settings.visibility} onChange={(v) => update({ visibility: v })} />
                <CheckboxField label="Show me in search" checked={settings.searchable} onChange={(c) => update({ searchable: c })} />
              </>
            ),
          },
        ]}
      />
      <Button
        onClick={() => {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
          toast('Settings saved');
        }}
      >
        Save settings
      </Button>
    </>
  );
}
