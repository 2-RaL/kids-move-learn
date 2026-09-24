import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, UserPlus, Shield, User, Trash2, Key, CheckCircle2,
  AlertCircle, RefreshCw, Search, ShieldAlert, Check, Ban
} from 'lucide-react';
import { useAuthStore, type AuthUser } from '../../store/authStore';
import { apiUrl } from '../../config/api';

export const AdminPanel: React.FC = () => {
  const { token, user: currentAdmin, setShowAdminPanel } = useAuthStore();

  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  // New user form state
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');

  // Change password modal state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');

  const fetchUsers = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/admin/users'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'İstifadəçiləri yükləmək mümkün olmadı');
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);

    try {
      const res = await fetch(apiUrl('/api/admin/users'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUsername,
          displayName: newDisplayName,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'İstifadəçi yaradıla bilmədi');

      showNotification(`"${data.user.displayName || data.user.username}" uğurla yaradıldı!`);
      setNewUsername('');
      setNewDisplayName('');
      setNewPassword('');
      setActiveTab('list');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (targetUser: AuthUser) => {
    if (!token) return;
    if (targetUser.id === currentAdmin?.id) {
      setError('Öz hesabınızı deaktiv edə bilməzsiniz!');
      return;
    }

    try {
      const res = await fetch(apiUrl(`/api/admin/users/${targetUser.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !targetUser.isActive }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Status yenilənmədi');

      showNotification(`İstifadəçi statusu dəyişdirildi.`);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChangePassword = async (userId: string) => {
    if (!token || !editPassword) return;

    try {
      const res = await fetch(apiUrl(`/api/admin/users/${userId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: editPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Şifrə dəyişdirilə bilmədi');

      showNotification(`Şifrə uğurla yeniləndi!`);
      setEditingUserId(null);
      setEditPassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!token) return;
    if (userId === currentAdmin?.id) {
      setError('Özünüzü silə bilməzsiniz!');
      return;
    }

    if (!window.confirm(`"${name}" adlı istifadəçini silmək istədiyinizə əminsiniz?`)) {
      return;
    }

    try {
      const res = await fetch(apiUrl(`/api/admin/users/${userId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'İstifadəçi silinmədi');

      showNotification('İstifadəçi silindi.');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-black">Admin İdarəetmə Paneli</h2>
              <p className="text-xs text-indigo-100 font-medium">
                İstifadəçi və şifrə idarəetməsi • Kids Move & Learn
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdminPanel(false)}
            className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="font-black text-sm ml-2">×</button>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="flex-1">{successMsg}</span>
          </div>
        )}

        {/* Navigation Tabs & Stats */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              İstifadəçilər ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Yeni İstifadəçi Əlavə Et
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchUsers}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Yenilə"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'list' ? (
            <div>
              {/* Search Bar */}
              <div className="mb-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="İstifadəçi adı və ya ad ilə axtar..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* Users Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">İstifadəçi</th>
                      <th className="p-3.5">Rol</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 hidden md:table-cell">Son Giriş</th>
                      <th className="p-3.5 text-right">Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-400 font-semibold">
                          Heç bir istifadəçi tapılmadı
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isSelf = u.id === currentAdmin?.id;
                        return (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                  {u.displayName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-black text-slate-800 flex items-center gap-1.5">
                                    {u.displayName}
                                    {isSelf && (
                                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md font-bold">
                                        Siz
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">@{u.username}</div>
                                </div>
                              </div>
                            </td>

                            <td className="p-3.5">
                              {u.role === 'admin' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black">
                                  👑 Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-black">
                                  🧒 İstifadəçi
                                </span>
                              )}
                            </td>

                            <td className="p-3.5">
                              {u.isActive ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  Aktiv
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                                  Deaktiv
                                </span>
                              )}
                            </td>

                            <td className="p-3.5 text-xs text-slate-400 hidden md:table-cell">
                              {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('az-AZ') : 'Giriş etməyib'}
                            </td>

                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Change Password */}
                                <button
                                  onClick={() => {
                                    setEditingUserId(editingUserId === u.id ? null : u.id);
                                    setEditPassword('');
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                                  title="Şifrəni dəyiş"
                                >
                                  <Key className="w-4 h-4" />
                                </button>

                                {/* Toggle Active */}
                                {!isSelf && (
                                  <button
                                    onClick={() => handleToggleActive(u)}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      u.isActive
                                        ? 'hover:bg-rose-100 text-rose-600'
                                        : 'hover:bg-emerald-100 text-emerald-600'
                                    }`}
                                    title={u.isActive ? 'Deaktiv et' : 'Aktivləşdir'}
                                  >
                                    {u.isActive ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                  </button>
                                )}

                                {/* Delete User */}
                                {!isSelf && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.displayName)}
                                    className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                                    title="Sil"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              {/* Inline Password Edit Row */}
                              {editingUserId === u.id && (
                                <div className="mt-2 flex items-center justify-end gap-2">
                                  <input
                                    type="password"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)}
                                    placeholder="Yeni şifrə"
                                    className="px-2.5 py-1 text-xs border rounded-lg focus:outline-none focus:border-indigo-500 w-32"
                                  />
                                  <button
                                    onClick={() => handleChangePassword(u.id)}
                                    className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
                                  >
                                    Saxla
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Create New User Form */
            <form onSubmit={handleCreateUser} className="max-w-lg mx-auto space-y-4 py-2">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                  <UserPlus className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Yeni İstifadəçi Əlavə Et</h3>
                <p className="text-xs text-slate-500">
                  Bu istifadəçi yalnız sizin verdiyiniz şifrə ilə sistemə daxil ola biləcək.
                </p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                  Görünən Ad (Məs: Murad, Ayan və s.)
                </label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="Uşağın və ya istifadəçinin tam adı"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                  İstifadəçi Adı (Giriş üçün)
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Məs: murad2026"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                  Şifrə (Ən az 4 simvol)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Məs: 123456"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                  minLength={4}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1 uppercase tracking-wider">
                  Rol
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewRole('user')}
                    className={`py-3 px-4 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newRole === 'user'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Uşaq / İstifadəçi
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('admin')}
                    className={`py-3 px-4 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newRole === 'admin'
                        ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-600" />
                    Admin
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all cursor-pointer"
                >
                  İstifadəçini Yarat
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
