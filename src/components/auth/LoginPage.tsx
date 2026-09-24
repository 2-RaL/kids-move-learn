import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Sparkles, Lock, User, Eye, EyeOff, ShieldCheck, Globe, Settings, Check, AlertCircle, RefreshCw, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useGameStore } from '../../store/gameStore';
import { getApiBaseUrl, setCustomApiUrl, apiUrl } from '../../config/api';
import type { Language } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const { language, setLanguage } = useGameStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Server connection configuration state (crucial for mobile APK sync)
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState('');
  const [activeServerUrl, setActiveServerUrl] = useState('');
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [pingMessage, setPingMessage] = useState('');

  useEffect(() => {
    const current = getApiBaseUrl();
    setActiveServerUrl(current);
    setServerUrlInput(current);
  }, []);

  const handleTestConnection = async (testUrl?: string) => {
    const targetUrl = (testUrl !== undefined ? testUrl : serverUrlInput).trim().replace(/\/+$/, '');
    setPingStatus('testing');
    setPingMessage('Qoşulma yoxlanılır...');
    try {
      const endpoint = targetUrl ? `${targetUrl}/api/health` : '/api/health';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        setPingStatus('success');
        setPingMessage('Əlaqə uğurludur! Server aktivdir.');
      } else {
        setPingStatus('error');
        setPingMessage(`Server xəta qaytardı: HTTP ${res.status}`);
      }
    } catch (err: any) {
      setPingStatus('error');
      setPingMessage('Serverə qoşulmaq mümkün olmadı. Ünvanı və ya interneti yoxlayın.');
    }
  };

  const handleSaveServerUrl = () => {
    setCustomApiUrl(serverUrlInput);
    const updated = getApiBaseUrl();
    setActiveServerUrl(updated);
    setIsServerModalOpen(false);
  };

  const handleResetServerUrl = () => {
    setCustomApiUrl('');
    const updated = getApiBaseUrl();
    setActiveServerUrl(updated);
    setServerUrlInput(updated);
    setPingStatus('idle');
    setPingMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    await login(username.trim(), password);
  };

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    clearError();
  };

  const texts = {
    az: {
      welcome: 'Xoş Gəlmisiniz!',
      subtitle: 'Öyrənmə və hərəkət dünyasına başlamaq üçün daxil olun',
      userLabel: 'İstifadəçi adı',
      userPlaceholder: 'Adınızı daxil edin',
      passLabel: 'Şifrə',
      passPlaceholder: 'Şifrənizi daxil edin',
      loginBtn: 'Daxil Ol',
      loadingBtn: 'Giriş edilir...',
      quickTest: 'Sürətli Giriş Testi:',
      adminRole: 'Admin hesabı',
      userRole: 'Uşaq hesabı',
      footerText: 'Təhlükəsiz və qorunan uşaq təhsil platforması',
    },
    en: {
      welcome: 'Welcome!',
      subtitle: 'Sign in to start learning, moving, and having fun',
      userLabel: 'Username',
      userPlaceholder: 'Enter your username',
      passLabel: 'Password',
      passPlaceholder: 'Enter your password',
      loginBtn: 'Sign In',
      loadingBtn: 'Signing in...',
      quickTest: 'Quick Demo Login:',
      adminRole: 'Admin Account',
      userRole: 'Kid Account',
      footerText: 'Safe & protected educational platform for kids',
    },
    ru: {
      welcome: 'Добро пожаловать!',
      subtitle: 'Войдите, чтобы начать учиться и двигаться с удовольствием',
      userLabel: 'Имя пользователя',
      userPlaceholder: 'Введите логин',
      passLabel: 'Пароль',
      passPlaceholder: 'Введите пароль',
      loginBtn: 'Войти',
      loadingBtn: 'Вход...',
      quickTest: 'Быстрый вход для теста:',
      adminRole: 'Аккаунт Админа',
      userRole: 'Аккаунт Ребёнка',
      footerText: 'Безопасная обучающая платформа для детей',
    },
  }[language] || {
    welcome: 'Xoş Gəlmisiniz!',
    subtitle: 'Öyrənmə və hərəkət dünyasına başlamaq üçün daxil olun',
    userLabel: 'İstifadəçi adı',
    userPlaceholder: 'Adınızı daxil edin',
    passLabel: 'Şifrə',
    passPlaceholder: 'Şifrənizi daxil edin',
    loginBtn: 'Daxil Ol',
    loadingBtn: 'Giriş edilir...',
    quickTest: 'Sürətli Giriş Testi:',
    adminRole: 'Admin hesabı',
    userRole: 'Uşaq hesabı',
    footerText: 'Təhlükəsiz və qorunan uşaq təhsil platforması',
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Playful Floating Background Shapes */}
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-10 w-24 h-24 bg-yellow-300/30 rounded-full blur-xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 right-12 w-36 h-36 bg-pink-300/30 rounded-full blur-xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 right-1/4 w-32 h-32 bg-cyan-300/25 rounded-full blur-xl pointer-events-none"
      />

      {/* Language Switcher in top right */}
      <div className="absolute top-5 right-5 z-20 flex gap-2 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-white/60">
        {(['az', 'en', 'ru'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all ${
              language === lang
                ? 'bg-white text-indigo-700 shadow-sm scale-105'
                : 'text-white/90 hover:text-white'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/80 relative z-10"
      >
        {/* Header with Mascot Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-pink-500 text-white shadow-lg mb-4 ring-4 ring-white/70">
            <Sparkles className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
            Kids Move & Learn
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">{texts.subtitle}</p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5 p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-700 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2"
          >
            <span>⚠️</span>
            <span className="flex-1">{error}</span>
            <button
              onClick={clearError}
              className="text-rose-500 hover:text-rose-800 text-base font-bold ml-1"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
              {texts.userLabel}
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) clearError();
                }}
                placeholder={texts.userPlaceholder}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
              {texts.passLabel}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                placeholder={texts.passPlaceholder}
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-base shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 hover:shadow-xl transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>{texts.loadingBtn}</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>{texts.loginBtn}</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Strict Access Security Notice */}
        <div className="mt-6 pt-4 border-t border-slate-100/80 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Yalnız icazəsi olan istifadəçilər daxil ola bilər</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-slate-400 text-xs text-center font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{texts.footerText}</span>
        </div>

        {/* Server Connection Status & Config (for Mobile APK & Web Sync) */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate max-w-[220px]" title={activeServerUrl || 'Lokal / Eyni Server'}>
            <span className={`w-2 h-2 rounded-full ${activeServerUrl ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
            <span className="truncate font-medium">
              {activeServerUrl ? activeServerUrl.replace(/^https?:\/\//, '') : 'Eyni Server (Avto)'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setServerUrlInput(getApiBaseUrl());
              setPingStatus('idle');
              setPingMessage('');
              setIsServerModalOpen(true);
            }}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Server</span>
          </button>
        </div>
      </motion.div>

      {/* Server Configuration Modal */}
      <AnimatePresence>
        {isServerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base">Server Əlaqəsi (Sinxronizasiya)</h3>
                    <p className="text-xs text-slate-500">Mobil APK və ya Web üçün backend ünvanı</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsServerModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Backend API URL
                  </label>
                  <input
                    type="text"
                    value={serverUrlInput}
                    onChange={(e) => setServerUrlInput(e.target.value)}
                    placeholder="https://kids-move-learn.onrender.com və ya http://192.168.1.50:3001"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Boş buraxıldıqda standart deploy ünvanı (Render.com) və ya cari host istifadə edilir.
                  </p>
                </div>

                {/* Connection Ping Status */}
                {pingStatus !== 'idle' && (
                  <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    pingStatus === 'testing' ? 'bg-indigo-50 text-indigo-700' :
                    pingStatus === 'success' ? 'bg-emerald-50 text-emerald-700' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                    {pingStatus === 'testing' && <RefreshCw className="w-4 h-4 animate-spin shrink-0" />}
                    {pingStatus === 'success' && <Check className="w-4 h-4 shrink-0" />}
                    {pingStatus === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{pingMessage}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleTestConnection()}
                    disabled={pingStatus === 'testing'}
                    className="flex-1 py-2 px-3 rounded-xl border border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${pingStatus === 'testing' ? 'animate-spin' : ''}`} />
                    <span>Əlaqəni Yoxla</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetServerUrl}
                    className="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Sıfırla
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveServerUrl}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20"
                  >
                    Yadda Saxla
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
