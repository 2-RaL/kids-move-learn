import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type { User, SafeUser } from './types';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function toSafeUser(user: User): SafeUser {
  const { passwordHash: _hash, ...safe } = user;
  return safe;
}

export function readUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    // Seed default admin user: username 'admin', password 'admin123'
    const defaultAdmin: User = {
      id: 'usr_admin_1',
      username: 'admin',
      passwordHash: bcrypt.hashSync('admin123', 10),
      displayName: 'Sistem Admini',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    // Seed a sample child / student user: username 'usaq1', password '123456'
    const defaultUser: User = {
      id: 'usr_kid_1',
      username: 'usaq1',
      passwordHash: bcrypt.hashSync('123456', 10),
      displayName: 'Nümunə Uşaq',
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    const initialUsers = [defaultAdmin, defaultUser];
    fs.writeFileSync(DB_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
    return initialUsers;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

export function writeUsers(users: User[]): void {
  ensureDataDir();
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(users, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

export function findUserByUsername(username: string): User | undefined {
  const users = readUsers();
  return users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
}

export function findUserById(id: string): User | undefined {
  const users = readUsers();
  return users.find((u) => u.id === id);
}

export function createUser(data: {
  username: string;
  password: string;
  displayName: string;
  role?: 'admin' | 'user';
}): SafeUser {
  const users = readUsers();
  const existing = users.find(
    (u) => u.username.toLowerCase() === data.username.trim().toLowerCase()
  );
  if (existing) {
    throw new Error('Bu istifadəçi adı artıq mövcuddur!');
  }

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username: data.username.trim().toLowerCase(),
    passwordHash: bcrypt.hashSync(data.password, 10),
    displayName: data.displayName.trim() || data.username.trim(),
    role: data.role || 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);
  return toSafeUser(newUser);
}

export function updateUser(
  id: string,
  updates: {
    password?: string;
    displayName?: string;
    role?: 'admin' | 'user';
    isActive?: boolean;
    lastLoginAt?: string;
  }
): SafeUser {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    throw new Error('İstifadəçi tapılmadı!');
  }

  const target = users[idx];
  if (updates.password) {
    target.passwordHash = bcrypt.hashSync(updates.password, 10);
  }
  if (updates.displayName !== undefined) {
    target.displayName = updates.displayName.trim();
  }
  if (updates.role !== undefined) {
    target.role = updates.role;
  }
  if (updates.isActive !== undefined) {
    target.isActive = updates.isActive;
  }
  if (updates.lastLoginAt !== undefined) {
    target.lastLoginAt = updates.lastLoginAt;
  }

  users[idx] = target;
  writeUsers(users);
  return toSafeUser(target);
}

export function deleteUser(id: string, currentAdminId: string): void {
  if (id === currentAdminId) {
    throw new Error('Öz hesabınızı silə bilməzsiniz!');
  }

  const users = readUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) {
    throw new Error('İstifadəçi tapılmadı!');
  }

  writeUsers(filtered);
}
