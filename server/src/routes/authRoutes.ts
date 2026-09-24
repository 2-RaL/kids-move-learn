import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByUsername, updateUser, toSafeUser } from '../db';
import { generateToken, authMiddleware, type AuthenticatedRequest } from '../auth';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'İstifadəçi adı və şifrə daxil edilməlidir!' });
      return;
    }

    const user = findUserByUsername(username);
    if (!user) {
      res.status(401).json({ error: 'İstifadəçi adı və ya şifrə yanlışdır!' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ error: 'Hesabınız deaktiv edilib. Administrator ilə əlaqə saxlayın.' });
      return;
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'İstifadəçi adı və ya şifrə yanlışdır!' });
      return;
    }

    // Update last login
    const updated = updateUser(user.id, { lastLoginAt: new Date().toISOString() });

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    res.json({
      token,
      user: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Daxili server xətası' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

export default router;
