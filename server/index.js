import "./loadEnv.js";
import express from "express";
import cors from "cors";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { readDb, writeDb } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error("Please set ADMIN_PASSWORD in server/.env (see .env.example)");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

app.set("trust proxy", 1);
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));
app.use("/uploads", express.static(uploadsDir)); // عکس‌های آپلود شده

/* ---------- کمک‌کننده‌ها ---------- */

// متن را تمیز می‌کند: فاصله‌های اضافه را برمی‌دارد و طول را محدود می‌کند
const text = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const isUrl = (value) => /^https?:\/\//i.test(value);
const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
const isImagePath = (value) =>
  /^(\/(uploads|screenshots)\/|https?:\/\/)/i.test(value);

// محدودیت تعداد درخواست (برای جلوگیری از اسپم و حدس زدن رمز)
function rateLimit(max, windowMs) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const recent = (hits.get(req.ip) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      return res
        .status(429)
        .json({ error: "Too many requests. Please try again later." });
    }
    recent.push(now);
    hits.set(req.ip, recent);
    next();
  };
}

/* ---------- ورود ادمین ---------- */

const tokens = new Set(); // توکن‌های معتبر (با ری‌استارت سرور پاک می‌شوند)

function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!tokens.has(token)) {
    return res.status(401).json({ error: "Not authorized" });
  }
  next();
}

app.post("/api/login", rateLimit(10, 15 * 60 * 1000), (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Wrong password" });
  }
  const token = crypto.randomBytes(32).toString("hex");
  tokens.add(token);
  res.json({ token });
});

/* ---------- پروژه‌ها و مهارت‌ها (CRUD) ---------- */
// هر تابع clean اطلاعات را بررسی می‌کند و { error } یا { item } برمی‌گرداند

function cleanProject(body) {
  const item = {
    title: text(body.title, 100),
    description: text(body.description, 600),
    image: text(body.image, 300),
    alt: text(body.alt, 200),
    liveUrl: text(body.liveUrl, 300),
  };
  if (!item.title || !item.description || !item.alt) {
    return { error: "Title, description and alt text are required." };
  }
  if (!isUrl(item.liveUrl)) {
    return { error: "Live link must start with http:// or https://" };
  }
  if (!isImagePath(item.image)) {
    return { error: "Please upload a screenshot for this project." };
  }
  return { item };
}

function cleanSkill(body) {
  const item = { name: text(body.name, 50), detail: text(body.detail, 200) };
  if (!item.name) return { error: "Skill name is required." };
  return { item };
}

// برای "projects" و "skills" یک مجموعه‌ی کامل GET / POST / PUT / DELETE می‌سازد
function addCrudRoutes(name, clean) {
  app.get(`/api/${name}`, (req, res) => {
    res.json(readDb()[name]);
  });

  app.post(`/api/${name}`, requireAuth, (req, res) => {
    const { error, item } = clean(req.body);
    if (error) return res.status(400).json({ error });
    const db = readDb();
    const newItem = { id: Date.now(), ...item };
    db[name].push(newItem);
    writeDb(db);
    res.status(201).json(newItem);
  });

  app.put(`/api/${name}/:id`, requireAuth, (req, res) => {
    const { error, item } = clean(req.body);
    if (error) return res.status(400).json({ error });
    const db = readDb();
    const index = db[name].findIndex((x) => String(x.id) === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db[name][index] = { id: db[name][index].id, ...item };
    writeDb(db);
    res.json(db[name][index]);
  });

  app.delete(`/api/${name}/:id`, requireAuth, (req, res) => {
    const db = readDb();
    db[name] = db[name].filter((x) => String(x.id) !== req.params.id);
    writeDb(db);
    res.json({ ok: true });
  });
}

addCrudRoutes("projects", cleanProject);
addCrudRoutes("skills", cleanSkill);

/* ---------- پروفایل (متن‌های سایت) ---------- */

const profileFields = {
  name: 100,
  role: 100,
  intro: 400,
  bio: 800,
  journey: 800,
  goals: 800,
  email: 100,
  github: 200,
  linkedin: 200,
};

app.get("/api/profile", (req, res) => {
  res.json(readDb().profile);
});

app.put("/api/profile", requireAuth, (req, res) => {
  const profile = {};
  for (const field in profileFields) {
    profile[field] = text(req.body[field], profileFields[field]);
  }
  if (!profile.name || !profile.role) {
    return res.status(400).json({ error: "Name and role are required." });
  }
  if (profile.email && !isEmail(profile.email)) {
    return res.status(400).json({ error: "Email is not valid." });
  }
  for (const link of [profile.github, profile.linkedin]) {
    if (link && !isUrl(link)) {
      return res
        .status(400)
        .json({ error: "GitHub and LinkedIn links must start with https://" });
    }
  }
  const db = readDb();
  db.profile = profile;
  writeDb(db);
  res.json(profile);
});

/* ---------- پیام‌های فرم تماس ---------- */

app.post("/api/messages", rateLimit(5, 10 * 60 * 1000), (req, res) => {
  const name = text(req.body.name, 100);
  const email = text(req.body.email, 100);
  const message = text(req.body.message, 2000);

  if (name.length < 2)
    return res.status(400).json({ error: "Please enter your name." });
  if (!isEmail(email))
    return res.status(400).json({ error: "Please enter a valid email." });
  if (message.length < 10)
    return res.status(400).json({ error: "Message is too short." });

  const db = readDb();
  db.messages.push({
    id: Date.now(),
    name,
    email,
    message,
    date: new Date().toISOString(),
  });
  writeDb(db);
  res.status(201).json({ ok: true });
});

app.get("/api/messages", requireAuth, (req, res) => {
  res.json([...readDb().messages].reverse()); // جدیدترین اول
});

app.delete("/api/messages/:id", requireAuth, (req, res) => {
  const db = readDb();
  db.messages = db.messages.filter((m) => String(m.id) !== req.params.id);
  writeDb(db);
  res.json({ ok: true });
});

/* ---------- آپلود عکس ---------- */

const allowedTypes = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      cb(
        null,
        crypto.randomBytes(8).toString("hex") + allowedTypes[file.mimetype],
      );
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // حداکثر ۲ مگابایت
  fileFilter: (req, file, cb) => cb(null, file.mimetype in allowedTypes),
});

app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Please choose a PNG, JPG or WebP image." });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

/* ---------- مدیریت خطا ---------- */

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Image is larger than 2MB." });
  }
  console.error(err);
  res.status(err.status || 500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
