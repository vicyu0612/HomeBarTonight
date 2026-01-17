import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, 'blurhash_update_payload.json');
const dataStr = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(dataStr);

// Start transaction if possible, or just a big statement
let sql = "UPDATE recipes SET blurhash = CASE id ";
const ids = [];
let count = 0;

for (const [id, hash] of Object.entries(data)) {
    // Basic SQL escaping: single quote to double single quote
    const safeHash = hash.replace(/'/g, "''");
    const safeId = id.replace(/'/g, "''");

    sql += `WHEN '${safeId}' THEN '${safeHash}' `;
    ids.push(`'${safeId}'`);
    count++;
}

sql += `END WHERE id IN (${ids.join(',')});`;

fs.writeFileSync(path.join(__dirname, 'update_blurhash.sql'), sql);
console.log('SQL written to update_blurhash.sql');
