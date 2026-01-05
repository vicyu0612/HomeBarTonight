
import re
import os

recipes_file = "/Users/vic-yu/Library/Mobile Documents/com~apple~CloudDocs/Antigravity/HomeBarTonight/src/data/recipes.ts"
public_dir = "/Users/vic-yu/Library/Mobile Documents/com~apple~CloudDocs/Antigravity/HomeBarTonight/public"

with open(recipes_file, 'r') as f:
    content = f.read()

# Regex to find image: '...'
images = re.findall(r"image:\s*'([^']+)'", content)

print(f"Found {len(images)} image references in recipes.ts")

# Get actual files in public/cocktails
# We want to check exact case matches.
# But images include the path /cocktails/xxx.png
# We assume all are in public/cocktails for now or public/

missing_or_mismatch = []

for img_path in images:
    # img_path is like '/cocktails/old-fashioned.png'
    # relative path: 'cocktails/old-fashioned.png'
    rel_path = img_path.lstrip('/')
    parts = rel_path.split('/')
    
    current_dir = public_dir
    valid = True
    
    for part in parts:
        try:
            # List directory content
            files = os.listdir(current_dir)
            if part in files:
                current_dir = os.path.join(current_dir, part)
            else:
                valid = False
                break
        except OSError:
            valid = False
            break
            
    if not valid:
        missing_or_mismatch.append(img_path)

if missing_or_mismatch:
    print("Case mismatch or missing images:")
    for m in missing_or_mismatch:
        print(f"- {m}")
else:
    print("All referenced images exist with correct case.")
