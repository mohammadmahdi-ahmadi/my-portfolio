import fs from "fs";

// دیتابیس ما یک فایل JSON ساده است (برای پروژه‌ی کوچک کافی است)
const FILE = new URL("./data/db.json", import.meta.url);

export function readDb() {
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

export function writeDb(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}
