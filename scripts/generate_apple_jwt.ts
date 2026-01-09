
import jwt from 'jsonwebtoken';
import fs from 'fs';


const TEAM_ID = 'KGN4NEE345';
const KEY_ID = '4DFJMYKY8F';
const CLIENT_ID = 'com.vic.homebartonight.service';
const P8_FILE_NAME = 'apple_key.p8';

if (!fs.existsSync(P8_FILE_NAME)) {
    console.log(`❌ Place ${P8_FILE_NAME} in root`);
    process.exit(1);
}
const privateKey = fs.readFileSync(P8_FILE_NAME, 'utf8');
const token = jwt.sign({}, privateKey, {
    algorithm: 'ES256', expiresIn: '180d', audience: 'https://appleid.apple.com',
    issuer: TEAM_ID, subject: CLIENT_ID, keyid: KEY_ID,
});
console.log('Token:', token);
