export interface User {
  id: string;
  username: string;
  email?: string;
  theme: 'dark' | 'light';
  createdAt: string;
}
