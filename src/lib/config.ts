import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

export interface AppEntry {
  name: string;
  description: string;
  url: string;
  logo?: string;
  status?: 'online' | 'offline' | 'unknown';
}

export interface HubConfig {
  name: string;
  tagline?: string;
  logo?: string;
}

export interface FullConfig {
  hub: HubConfig;
  apps: AppEntry[];
}

const DEFAULT_CONFIG: FullConfig = {
  hub: {
    name: 'App Hub',
    tagline: 'Panel de control de aplicaciones',
    logo: '/default-logo.svg',
  },
  apps: [],
};

// Path is overridable via env var so it can point at a mounted volume in Docker.
const CONFIG_PATH = process.env.CONFIG_PATH || './data/config.json';

export async function loadConfig(): Promise<FullConfig> {
  try {
    if (!existsSync(CONFIG_PATH)) {
      return DEFAULT_CONFIG;
    }
    const raw = await readFile(CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw);

    return {
      hub: {
        name: parsed?.hub?.name?.trim() || DEFAULT_CONFIG.hub.name,
        tagline: parsed?.hub?.tagline?.trim() || DEFAULT_CONFIG.hub.tagline,
        logo: parsed?.hub?.logo?.trim() || DEFAULT_CONFIG.hub.logo,
      },
      apps: Array.isArray(parsed?.apps)
        ? parsed.apps
            .filter((a: any) => a?.name && a?.url)
            .map((a: any) => ({
              name: String(a.name),
              description: String(a.description || ''),
              url: String(a.url),
              logo: a.logo ? String(a.logo) : undefined,
              status: ['online', 'offline'].includes(a.status) ? a.status : 'unknown',
            }))
        : [],
    };
  } catch (err) {
    console.error('[config] Failed to read config, falling back to defaults:', err);
    return DEFAULT_CONFIG;
  }
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
