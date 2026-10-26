import fs from "fs";
import { readDb } from "./db.js";

// محتوای CMS را به فایل‌های ثابت داخل پوشه‌ی public تبدیل می‌کند
const publicDir = new URL("../public/", import.meta.url);
const uploadsDir = new URL("./uploads/", import.meta.url);

const db = readDb();
const content = { profile: db.profile, projects: db.projects, skills: db.skills };
fs.writeFileSync(
  new URL("content.json", publicDir),
  JSON.stringify(content, null, 2)
);

// عکس‌های آپلودشده را هم کپی می‌کنیم
const targetDir = new URL("uploads/", publicDir);
fs.mkdirSync(targetDir, { recursive: true });
let count = 0;
for (const file of fs.readdirSync(uploadsDir)) {
  if (file === ".gitkeep") continue;
  fs.copyFileSync(new URL(file, uploadsDir), new URL(file, targetDir));
  count++;
}

console.log(`Done: public/content.json created, ${count} image(s) copied.`);