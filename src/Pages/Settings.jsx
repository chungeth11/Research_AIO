import { useState } from "react";

const storageKey = "research-aio-settings";
const defaultSettings = {
  scheduleReminders: true,
  experimentUpdates: true,
  weeklySummary: false,
};

function loadSettings() {
  try {
    const storedSettings = window.localStorage.getItem(storageKey);
    if (!storedSettings) return { ...defaultSettings };

    const parsedSettings = JSON.parse(storedSettings);
    return {
      ...defaultSettings,
      ...parsedSettings,
    };
  } catch {
    return { ...defaultSettings };
  }
}

function Settings() {
  const [settings, setSettings] = useState(loadSettings);
  const [saveMessage, setSaveMessage] = useState("");

  function updateSetting(event) {
    const { name, checked } = event.target;
    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: checked,
    }));
    setSaveMessage("");
  }

  function saveSettings(event) {
    event.preventDefault();
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(settings));
      setSaveMessage("Your preferences have been saved in this browser.");
    } catch (error) {
      setSaveMessage(`Could not save your preferences: ${error.message}`);
    }
  }

  function restoreDefaults() {
    setSettings({ ...defaultSettings });
    setSaveMessage("");
  }

  const preferences = [
    {
      name: "scheduleReminders",
      title: "Schedule reminders",
      description: "Preference for reminders about upcoming lab events.",
    },
    {
      name: "experimentUpdates",
      title: "Experiment updates",
      description: "Preference for updates when experiment details change.",
    },
    {
      name: "weeklySummary",
      title: "Weekly lab summary",
      description: "Preference for a weekly overview of lab activity.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl text-slate-900">
      <header className="mb-8">
        <p className="text-sm font-semibold text-blue-600">Account</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your ResearchAIO preferences.
        </p>
      </header>

      <form onSubmit={saveSettings} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose which lab updates you would like to receive.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {preferences.map(({ name, title, description }) => (
              <label
                key={name}
                className="flex cursor-pointer items-center justify-between gap-5 py-4"
              >
                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    {title}
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {description}
                  </span>
                </span>
                <input
                  type="checkbox"
                  name={name}
                  checked={settings[name]}
                  onChange={updateSetting}
                  className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
          <p className="text-xs leading-5 text-slate-500">
            Preferences are stored in this browser. Notification delivery is not
            connected yet.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {saveMessage && (
            <p role="status" className="mr-auto text-sm text-slate-600">
              {saveMessage}
            </p>
          )}
          <button
            type="button"
            onClick={restoreDefaults}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Restore defaults
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
