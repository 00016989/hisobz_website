# Hisobz — Marketing sayti

Hisobz savdo/ombor/kassa tizimining **ommaviy sayti**. Mustaqil Next.js loyihasi —
baza yoki ilova kodi yo'q. Uch tilda (O'zbek / Ruscha / Inglizcha), iOS uslubidagi dizayn.

## Texnologiya
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** (brend rangi — apelsin)
- Bog'lanish formasi → **Telegram** (ixtiyoriy)

## Ishga tushirish (local)
```bash
npm install
npm run dev      # http://localhost:3000
```

Ishlab chiqarish:
```bash
npm run build && npm start
```

## Sozlash
- **Aloqa ma'lumotlari:** `src/app/Landing.tsx` faylining boshidagi `CONTACT` blokini
  o'zgartiring (telefon, Telegram, email).
- **Telegram bildirishnoma:** `.env` ga `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID`
  qo'shing — forma murojaatlari Telegram'ga keladi. Bo'lmasa demo rejim.
- **Domen:** `NEXT_PUBLIC_SITE_URL` ni haqiqiy domeningizga qo'ying (OG/share kartasi uchun).

## Render'ga deploy
1. Bu repo'ni GitHub'da saqlang.
2. render.com → **New → Blueprint** → repo'ni ulang (`render.yaml` o'qiladi).
   - Yoki **New → Web Service**: Build `npm install && npm run build`, Start `npm start`.
3. Environment: `NEXT_PUBLIC_SITE_URL` (+ ixtiyoriy `TELEGRAM_*`).
4. Deploy → `https://...onrender.com`.

Baza kerak emas. Narxlar ko'rsatilmaydi — sayt bog'lanishga yo'naltirilgan.
