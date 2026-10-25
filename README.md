# React Developer Portfolio (Multi-page + Backend + CMS)

## ساختار
```
portfolio/
├─ src/            ← فرانت‌اند (React + Tailwind + React Router)
│  ├─ pages/       ← صفحه‌ی اصلی و 404
│  ├─ components/  ← Navbar, Hero, Projects, Skills, About, Contact, ...
│  └─ admin/       ← پنل CMS (ورود + مدیریت)
└─ server/         ← بک‌اند (Node + Express + فایل JSON)
```

## اجرا (دو ترمینال لازم است)
**ترمینال ۱ – سرور:**
```bash
cd server
npm install
cp .env.example .env     # در ویندوز: copy .env.example .env
# فایل .env را باز کن و ADMIN_PASSWORD را عوض کن
npm run dev              # http://localhost:5000
```
**ترمینال ۲ – سایت:**
```bash
npm install
npm run dev              # http://localhost:5173
```

## صفحه‌ها
`/` خانه · `/projects` · `/skills` · `/about` · `/contact` · `/admin/login` · `/admin`

## CMS چه کار می‌کند؟
در `/admin` با رمز ادمین وارد شو:
- **Projects:** افزودن، ویرایش، حذف و آپلود اسکرین‌شات
- **Skills:** افزودن، ویرایش، حذف
- **Profile & texts:** اسم، نقش، متن‌های Home و About، ایمیل و لینک‌ها
- **Messages:** پیام‌هایی که از فرم تماس آمده است

فرم تماس حالا پیام را به سرور خودت می‌فرستد و Formspree لازم نیست.

## API
| Method | Path | نیاز به ورود |
|---|---|---|
| POST | /api/login | – |
| GET | /api/profile, /api/projects, /api/skills | – |
| PUT | /api/profile | ✔ |
| POST, PUT, DELETE | /api/projects, /api/skills | ✔ |
| POST | /api/messages | – |
| GET, DELETE | /api/messages | ✔ |
| POST | /api/upload | ✔ |

## دیپلوی
1. **سرور** را روی Render یا Railway بگذار (Root directory: `server`، Start: `npm start`). متغیرهای محیطی: `ADMIN_PASSWORD` و `CLIENT_URL` (آدرس سایت).
2. **سایت** را روی Vercel/Netlify بگذار و متغیر `VITE_API_URL` را برابر آدرس سرور قرار بده.
3. ⚠️ داده‌ها در فایل `server/data/db.json` و عکس‌ها در `server/uploads` ذخیره می‌شوند. بسیاری از سرویس‌های رایگان دیسک دائمی ندارند، یعنی با هر ری‌استارت یا دیپلوی جدید داده‌های جدید پاک می‌شود. برای نسخه‌ی نهایی از دیسک دائمی یا دیتابیس (مثل MongoDB Atlas یا Supabase) استفاده کن.

## QA Checklist
| # | Test | Pass/Fail | Evidence / Fix |
|---|------|-----------|----------------|
| 1 | All menu links open the right page (desktop + mobile menu) | | |
| 2 | Every project "View live project" link opens | | |
| 3 | Contact: empty form shows 3 errors | | |
| 4 | Contact: invalid email shows error | | |
| 5 | Contact: valid data -> message appears in /admin > Messages | | |
| 6 | Contact: stop the server -> red error, NO fake success | | |
| 7 | Projects page: stop server -> error + "Try again" button | | |
| 8 | Phone (375px) – no horizontal scroll, no overlap | | |
| 9 | Tablet (768px) | | |
| 10 | Laptop (1280px) | | |
| 11 | Console has no errors | | |
| 12 | Keyboard: Tab reaches all links/inputs with visible focus | | |
| 13 | All images have alt; labels connected with htmlFor/id | | |
| 14 | Admin: add / edit / delete project works; wrong password rejected | | |
| 15 | Lighthouse performance checked (screenshot score) | | |
| 16 | Live (deployed) version tested again, refresh on /projects works | | |
