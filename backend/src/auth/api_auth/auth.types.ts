import { Role } from '../user.entity';

export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  role: Role;
}
