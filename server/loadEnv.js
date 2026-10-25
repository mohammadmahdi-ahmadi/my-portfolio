import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";

// مسیر فایل .env را کنار همین فایل پیدا می‌کنیم (مستقل از اینکه ترمینال کجاست)
const envPath = fileURLToPath(new URL("./.env", import.meta.url));

console.log(
  fs.existsSync(envPath)
    ? "Found .env at: " + envPath
    : "NO .env file at: " + envPath
);

const result = dotenv.config({ path: envPath });
console.log("Variables read from .env:", Object.keys(result.parsed || {}));