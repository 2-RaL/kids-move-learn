import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthTokenPayload, SafeUser } from './types';
import { findUserById, toSafeUser } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'kids-move-learn-super-secret-key-2026';
const TOKEN_EXPIRY = '7d';

export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
}

export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Giriş tələb olunur!' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    const user = findUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: 'İstifadəçi tapılmadı!' });
      return;
    }
    if (!user.isActive) {
      res.status(403).json({ error: 'Hesabınız deaktiv edilib!' });
      return;
    }
    req.user = toSafeUser(user);
    next();
  } catch {
    res.status(401).json({ error: 'Etibarsız və ya vaxtı bitmiş sessiya!' });
  }
}

export function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Bu əməliyyat üçün admin hüquqları tələb olunur!' });
    return;
  }
  next();
}
