/** Issuers e algoritmos dos JWTs próprios. Edge-safe (sem Prisma/bcrypt). */

export const ADMIN_JWT_ISSUER = 'calenza-adm';
export const RIDER_JWT_ISSUER = 'platefull-rider';
export const EMPLOYEE_JWT_ISSUER = 'platefull-employee';
export const EMPLOYEE_JWT_AUDIENCE = 'employee';
export const JWT_ALGORITHMS = ['HS256'] as const;
