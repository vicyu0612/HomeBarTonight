
import re
import os

recipes_file = "/Users/vic-yu/Library/Mobile Documents/com~apple~CloudDocs/Antigravity/HomeBarTonight/src/data/recipes.ts"
public_dir = "/Users/vic-yu/Library/Mobile Documents/com~apple~CloudDocs/Antigravity/HomeBarTonight/public"

with open(recipes_file, 'r') as f:
    content = f.read()

# Regex to find image: '...'
images = re.findall(r"image:\s*'([^']+)'", content)

print(f"Found {len(images)} image references in recipes.ts")

missing = []
for img_path in images:
    # Remove leading slash for os.path.join
    rel_path = img_path.lstrip('/')
    full_path = os.path.join(public_dir, rel_path)
    
    if not os.path.exists(full_path):
        missing.append(img_path)

if missing:
    print("Missing images:")
    for m in missing:
        print(f"- {m}")
else:
    print("All referenced images exist.")
