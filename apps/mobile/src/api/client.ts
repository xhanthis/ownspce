import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

// TODO: Set your deployed web app URL here for production builds
const API_BASE = __DEV__
  ? 'http://localhost:3000'
  : 'https://ownspce.vercel.app';

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

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (e: any) {
    throw new Error(`Network error: ${e.message}`);
  }

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
