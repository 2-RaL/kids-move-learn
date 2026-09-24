import { Router } from 'express';
import { readUsers, createUser, updateUser, deleteUser, toSafeUser } from '../db';
import { authMiddleware, adminMiddleware, type AuthenticatedRequest } from '../auth';

const router = Router();

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/users - List all users
router.get('/users', (_req, res) => {
  try {
    const users = readUsers().map(toSafeUser);
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Xəta baş verdi' });
  }
});

// POST /api/admin/users - Create a new user
router.post('/users', (req, res) => {
  try {
    const { username, password, displayName, role } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'İstifadəçi adı və şifrə mütləqdir!' });
      return;
    }
    if (password.length < 4) {
      res.status(400).json({ error: 'Şifrə ən az 4 simvoldan ibarət olmalıdır!' });
      return;
    }

    const newUser = createUser({
      username,
      password,
      displayName: displayName || username,
      role: role === 'admin' ? 'admin' : 'user',
    });

    res.status(201).json({ user: newUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Xəta baş verdi' });
  }
});

// PUT /api/admin/users/:id - Update user (password, role, isActive, displayName)
router.put('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { password, displayName, role, isActive } = req.body;

    const updated = updateUser(id, {
      ...(password ? { password } : {}),
      ...(displayName !== undefined ? { displayName } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    });

    res.json({ user: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Xəta baş verdi' });
  }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const currentAdminId = req.user?.id || '';

    deleteUser(id, currentAdminId);
    res.json({ success: true, message: 'İstifadəçi uğurla silindi' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Silinmə zamanı xəta baş verdi' });
  }
});

export default router;
