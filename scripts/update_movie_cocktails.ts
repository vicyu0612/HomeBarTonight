
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

const COCKTAILS_BUCKET = 'cocktails';

async function uploadImage(filePath: string, fileName: string) {
    const fileBuffer = fs.readFileSync(filePath);
    const { data, error } = await supabase.storage
        .from(COCKTAILS_BUCKET)
        .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error(`Error uploading ${fileName}:`, error);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(COCKTAILS_BUCKET)
        .getPublicUrl(fileName);

    return publicUrl;
}

async function main() {
    console.log("Starting Movie & Lit updates...");

    // 1. Upload Cosmopolitan Image
    // Note: You need to replace this path with the actual path of the generated image
    // I will use a placeholder or expect the user/agent to fill this in.
    // For now I will assume the image is at a specific location or I will return the SQL to run manually if upload fails.

    // START SQL GENERATION
    console.log("\n-- SQL TO EXECUTE --\n");

    // 1. Update Existing
    const updates = [
        {
            id: 'white-russian',
            desc_en: "The Dude abides. A rich, creamy dessert that gets you drunk. Popularized by *The Big Lebowski* as the ultimate bowling alley cooler.",
            desc_zh: "『督爺』(The Dude) 的精神糧食。或是說，針對大人的咖啡牛奶。濃郁奶香讓你忘記它其實很烈，保齡球之夜的必備良伴。"
        },
        {
            id: 'french-75',
            desc_en: "Named after the WWI field gun, but immortalized in *Casablanca*. \"Here's looking at you, kid.\" A sophisticated gin and champagne classic.",
            desc_zh: "以一次大戰的75毫米野戰砲命名，卻在電影《北非諜影》的里克咖啡館永恆流傳。「Here's looking at you, kid.」琴酒與香檳的優雅致敬。"
        },
        {
            id: 'old-fashioned',
            desc_en: "Don Draper's drink of choice in *Mad Men*. A timeless definition of cool, muddled with sugar and bitters.",
            desc_zh: "《廣告狂人》唐·雷普 (Don Draper) 的摯愛。經典中的經典，方糖、苦精與威士忌的永恆對話，定義了何謂成熟男人的品味。"
        },
        {
            id: 'martini', // dry-martini
            desc_en: "The King of Cocktails. While Bond prefers the Vesper, the classic Dry Martini remains the gold standard. Shaken or stirred?",
            desc_zh: "雞尾酒之王。雖然007更愛 Vesper，但這杯經典Dry Martini仍是紳士的標準配備。你要搖盪還是攪拌？"
        },
        {
            id: 'mojito',
            desc_en: "Cuba’s refreshing peppermint drink. A favorite of Ernest Hemingway in Havana. \"My mojito in La Bodeguita...\"",
            desc_zh: "古巴最清爽的薄荷特調。海明威 (Hemingway) 在哈瓦那的最愛，「我的莫西多在 La Bodeguita」讓這杯酒成為文豪的夏日標記。"
        },
        {
            id: 'mint-julep',
            desc_en: "The symbol of Southern elegance. In *The Great Gatsby*, it cools the tension of a hot summer afternoon at the Plaza Hotel.",
            desc_zh: "美國南方的優雅象徵。在《大亨小傳》中，它是黛西在廣場飯店為了緩解夏日悶熱與劍拔弩張氣氛的選擇。"
        }
    ];

    updates.forEach(u => {
        console.log(`UPDATE recipes SET description = jsonb_set(description, '{en}', '"${u.desc_en}"') WHERE id = '${u.id}';`);
        console.log(`UPDATE recipes SET description = jsonb_set(description, '{zh}', '"${u.desc_zh}"') WHERE id = '${u.id}';`);
    });

    // 2. Insert Cosmopolitan
    // We need the image URL first. 
    console.log(`
-- INSERT COSMOPOLITAN
INSERT INTO recipes (id, name, type, base_spirit, ingredients, steps, tags, description, specs, color, image, collections, is_premium)
VALUES (
  'cosmopolitan',
  '{"en": "Cosmopolitan", "zh": "柯夢波丹"}',
  'cocktail',
  'vodka',
  '{"en": [{"name": "Vodka", "amount": "45ml"}, {"name": "Cointreau", "amount": "15ml"}, {"name": "Lime Juice", "amount": "15ml"}, {"name": "Cranberry Juice", "amount": "30ml"}], "zh": [{"name": "伏特加", "amount": "45ml"}, {"name": "君度橙酒", "amount": "15ml"}, {"name": "檸檬汁", "amount": "15ml"}, {"name": "蔓越莓汁", "amount": "30ml"}]}',
  '{"en": ["Add all ingredients into a shaker with ice.", "Shake vigorously until well-chilled.", "Strain into a chilled cocktail glass.", "Garnish with a lime wheel."], "zh": ["將所有材料加入搖酒杯，加入冰塊。", "用力搖盪至冷卻。", "濾冰倒入冰鎮過的雞尾酒杯。", "以檸檬片裝飾。"]}',
  ARRAY['vodka', 'fruity', 'sour', 'classic', 'movie'],
  '{"en": "Popularized by *Sex and the City*. The definitive pink cocktail of 90s New York glam. Sweet, tart, and stylish.", "zh": "因《慾望城市》而紅遍全球。90年代紐約時尚的粉紅象徵，凱莉 (Carrie) 與姐妹們的聚會首選。酸甜優雅，風格獨具。"}',
  '{"glassware": "coupe", "difficulty": "medium"}',
  '#E91E63',
  'YOUR_IMAGE_URL_HERE', 
  ARRAY[],
  false
);
`);
}

main();
