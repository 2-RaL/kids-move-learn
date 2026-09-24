import os
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\0fbb3748-3e58-45a5-8d05-24fea004694d"
mockup_path = os.path.join(brain_dir, ".user_uploaded", "media_1789978159673.jpg")
dest_char_dir = r"c:\Users\User\Desktop\Proyektlər\kids-move-learn\public\assets\characters"
dest_portraits_dir = r"c:\Users\User\Desktop\Proyektlər\kids-move-learn\public\assets\portraits"

os.makedirs(dest_char_dir, exist_ok=True)
os.makedirs(dest_portraits_dir, exist_ok=True)

# 1. Inspect mockup
mockup = Image.open(mockup_path)
print("Mockup opened, size:", mockup.size)

# Crop the 6 character avatar cards from the left panel:
# Size is 1024 x 682
# Let's define the 6 crop boxes (left, upper, right, lower)
# Left panel cards:
# Row 1: Leyla (left) & Tom (right)
# Row 2: Amara (left) & Mei (right)
# Row 3: Leo (left) & Zara (right)
cards = {
    "girl_leyla": (16, 240, 96, 335),
    "boy_tom": (104, 240, 184, 335),
    "girl_amara": (16, 410, 96, 505),
    "girl_mei": (104, 410, 184, 505),
    "boy_leo": (16, 575, 96, 670),
    "girl_zara": (104, 575, 184, 670),
}

# Wait, let's verify where the cards actually are in the 1024x682 image!
# Let's inspect coordinates using proportional ratios
# Total W=1024, H=682
# Looking at media_1789978159673.jpg:
# Left panel occupies roughly x: 0 to 195.
# Let's inspect by sampling pixels or saving a crop test
for name, box in cards.items():
    crop = mockup.crop(box)
    out_path = os.path.join(dest_portraits_dir, f"{name}.jpg")
    crop.save(out_path)

print("Card crops saved!")

# 2. Transparent background remover using flood-fill from corners or color threshold
def make_transparent(input_path, output_path, tolerance=235):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r >= tolerance and g >= tolerance and b >= tolerance:
                min_val = min(r, g, b)
                alpha = max(0, int(255 - ((min_val - tolerance) / (255 - tolerance)) * 255))
                pixels[x, y] = (r, g, b, alpha)
                
    img.save(output_path, "PNG", optimize=True)
    print("Saved pose:", os.path.basename(output_path))

poses = {
    "standing": "leyla_standing_1789980113795.jpg",
    "waving": "leyla_waving_1789980132435.jpg",
    "jumping": "leyla_jumping_1789980150784.jpg",
    "sitting": "leyla_sitting_1789980165232.jpg",
    "running": "leyla_running_1789980181836.jpg",
}

for pose_name, filename in poses.items():
    in_file = os.path.join(brain_dir, filename)
    out_file = os.path.join(dest_char_dir, f"leyla_{pose_name}.png")
    if os.path.exists(in_file):
        make_transparent(in_file, out_file, tolerance=235)

print("All done!")
