import { Role } from 'generated/prisma/client';

export interface AccessTokenPayload {
  sub: string;
  role: Role;
}
