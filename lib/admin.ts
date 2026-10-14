// Autenticación sencilla del panel /admin con una contraseña (variable ADMIN_PASSWORD)
import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'raiz_admin';

export function adminToken() {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return null;
  return createHash('sha256').update(`raiz::${pass}`).digest('hex');
}

export function checkPassword(input: string) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return false;
  const a = Buffer.from(createHash('sha256').update(input).digest('hex'));
  const b = Buffer.from(createHash('sha256').update(pass).digest('hex'));
  return timingSafeEqual(a, b);
}

export function isAdmin() {
  const token = adminToken();
  const c = cookies().get(ADMIN_COOKIE)?.value;
  return !!token && c === token;
}
