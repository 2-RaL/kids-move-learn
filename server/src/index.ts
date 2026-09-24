import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import { readUsers } from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Initialize DB and default users if not created
readUsers();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Production: serve the Vite-built frontend ───────────────────────
// In production (Render.com), the dist/ folder sits at project root.
const distPath = path.resolve(__dirname, '..', '..', 'dist');

// Serve static assets (JS, CSS, images, etc.)
app.use(express.static(distPath));

// Serve character sprites and portraits
app.use('/assets', express.static(path.resolve(__dirname, '..', '..', 'public', 'assets')));

// SPA fallback — any non-API route returns index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
