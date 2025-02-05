import { userSettingsSchema, type UserSettings } from "@shared/schema";

const SETTINGS_KEY = "user_settings";

export function saveUserSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getUserSettings(): UserSettings | null {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return userSettingsSchema.parse(parsed);
  } catch {
    return null;
  }
}
