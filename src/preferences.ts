import { getPreferenceValues } from "@raycast/api";

export const preferences: Preferences = getPreferenceValues();

export interface Preferences {
  putioClientId: string;
  putioOAuthToken: string;
  tvShowDownloadCommand?: string;
  movieDownloadCommand?: string;
}