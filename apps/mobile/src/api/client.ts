import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

const API_BASE = __DEV__
  ? 'http://localhost:3000'
  : 'https://your-production-url.com';

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = storage.getString('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Server error (${res.status})`);
  }
  if (!res.ok) {
    throw new Error(json.error ?? 'Request failed');
  }
  return json;
}
