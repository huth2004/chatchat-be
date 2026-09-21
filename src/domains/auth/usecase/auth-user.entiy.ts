export class AuthUser {
  id!: string;
  username!: string;
  avatarUrl!: string | null;
  role!: 'user' | 'admin';
}
