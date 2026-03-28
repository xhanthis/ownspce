import { BlockContent } from '../types/block';

export function parseContent<T extends BlockContent>(json: string): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return {} as T;
  }
}

export function serializeContent(content: BlockContent): string {
  return JSON.stringify(content);
}
