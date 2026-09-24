# Render.com Deployment — Kids Move & Learn

## Deployment addımları:

### 1. GitHub-a push edin
```bash
git init
git add .
git commit -m "initial deploy"
git remote add origin https://github.com/SIZIN_USERNAME/kids-move-learn.git
git push -u origin main
```

### 2. Render.com-da yeni Web Service yaradın
1. https://render.com açın → hesab yaradın (GitHub ilə giriş asan)
2. **New → Web Service** seçin
3. GitHub reponu bağlayın
4. Aşağıdakı parametrləri daxil edin:
   - **Name**: `kids-move-learn`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx tsx server/src/index.ts`
   - **Environment**: `Node`
5. Environment Variables əlavə edin:
   - `PORT` = `10000`
   - `JWT_SECRET` = (istədiyiniz güclü açar sözü)
6. **Create Web Service** basın

### 3. Deploy tamamlandıqdan sonra
Sizin sayt bu ünvanda açılacaq:
```
https://kids-move-learn.onrender.com
```

### 4. APK build etmək üçün
```bash
# Capacitor APK build (Render URL ilə)
set VITE_API_URL=https://kids-move-learn.onrender.com
npm run build
npx cap sync
# Android Studio açın:
npx cap open android
# Android Studio-da Build → Build APK seçin
```
