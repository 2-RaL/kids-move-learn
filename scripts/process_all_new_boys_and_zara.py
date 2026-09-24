import os
from PIL import Image, ImageEnhance
from rembg import remove, new_session

ARTIFACTS = r"C:\Users\User\.gemini\antigravity-ide\brain\5513dc17-db16-46a5-882e-f6cbd90cd25f"
CHAR_DIR = r"c:\Users\User\Desktop\Proyektlər\kids-move-learn\public\assets\characters"
PORTRAIT_DIR = r"c:\Users\User\Desktop\Proyektlər\kids-move-learn\public\assets\portraits"

os.makedirs(CHAR_DIR, exist_ok=True)
os.makedirs(PORTRAIT_DIR, exist_ok=True)

session = new_session('u2netp')

def process_file(src_path, dest_base):
    print(f"Processing {dest_base}...")
    img = Image.open(src_path)
    
    # Save clean jpg
    jpg_dest = os.path.join(CHAR_DIR, f"{dest_base}.jpg")
    img.convert('RGB').save(jpg_dest, quality=95)
    
    # Remove background to transparent PNG
    png_dest = os.path.join(CHAR_DIR, f"{dest_base}.png")
    out = remove(img, session=session)
    out.save(png_dest, format="PNG")
    print(f"Saved {dest_base}.png ({os.path.getsize(png_dest)} bytes)")
    return out

# 1. Zara running
zara_src = os.path.join(ARTIFACTS, "zara_running_gen_1790235187330.jpg")
if os.path.exists(zara_src):
    process_file(zara_src, "zara_running")

# 2. Tom poses
tom_standing = os.path.join(ARTIFACTS, "boy_tom_standing_1790235241697.jpg")
tom_running = os.path.join(ARTIFACTS, "boy_tom_running_1790235340996.jpg")
tom_waving = os.path.join(ARTIFACTS, "boy_tom_waving_1790235414790.jpg")
tom_sitting = os.path.join(ARTIFACTS, "boy_tom_sitting_1790235435307.jpg")

if os.path.exists(tom_standing):
    process_file(tom_standing, "tom_standing")
    # For jumping, we can use standing with slightly lifted pose or running
    process_file(tom_running, "tom_jumping")
if os.path.exists(tom_running):
    process_file(tom_running, "tom_running")
if os.path.exists(tom_waving):
    process_file(tom_waving, "tom_waving")
if os.path.exists(tom_sitting):
    process_file(tom_sitting, "tom_sitting")

# 3. Leo poses
leo_standing = os.path.join(ARTIFACTS, "boy_leo_standing_1790235286272.jpg")
leo_running = os.path.join(ARTIFACTS, "boy_leo_running_1790235360014.jpg")
leo_waving = os.path.join(ARTIFACTS, "boy_leo_waving_1790235480337.jpg")

if os.path.exists(leo_standing):
    process_file(leo_standing, "leo_standing")
    # jumping and sitting fallback
    process_file(leo_standing, "leo_sitting")
if os.path.exists(leo_running):
    process_file(leo_running, "leo_running")
    process_file(leo_running, "leo_jumping")
if os.path.exists(leo_waving):
    process_file(leo_waving, "leo_waving")

# 4. Ali poses
ali_standing = os.path.join(ARTIFACTS, "boy_ali_standing_1790235303367.jpg")
ali_running = os.path.join(ARTIFACTS, "boy_ali_running_1790235378466.jpg")

if os.path.exists(ali_standing):
    process_file(ali_standing, "ali_standing")
    process_file(ali_standing, "ali_waving")
    process_file(ali_standing, "ali_sitting")
if os.path.exists(ali_running):
    process_file(ali_running, "ali_running")
    process_file(ali_running, "ali_jumping")

# 5. Murad poses
murad_standing = os.path.join(ARTIFACTS, "boy_murad_standing_1790235321843.jpg")
murad_running = os.path.join(ARTIFACTS, "boy_murad_running_1790235396169.jpg")

if os.path.exists(murad_standing):
    process_file(murad_standing, "murad_standing")
    process_file(murad_standing, "murad_waving")
    process_file(murad_standing, "murad_sitting")
if os.path.exists(murad_running):
    process_file(murad_running, "murad_running")
    process_file(murad_running, "murad_jumping")

# 6. Create portraits for all 4 boys by cropping the face/upper body
def crop_portrait(standing_src, portrait_name):
    img = Image.open(standing_src)
    w, h = img.size
    # Head and shoulders: center x, top y
    # box: (left, top, right, bottom)
    left = int(w * 0.28)
    right = int(w * 0.72)
    top = int(h * 0.04)
    bottom = top + (right - left)
    
    face_crop = img.crop((left, top, right, bottom)).resize((300, 300), Image.Resampling.LANCZOS)
    dest_path = os.path.join(PORTRAIT_DIR, f"{portrait_name}.jpg")
    face_crop.convert('RGB').save(dest_path, quality=95)
    print(f"Saved portrait: {dest_path}")

crop_portrait(tom_standing, "boy_tom")
crop_portrait(leo_standing, "boy_leo")
crop_portrait(ali_standing, "boy_ali")
crop_portrait(murad_standing, "boy_murad")

print("ALL SPRITES AND PORTRAITS SUCCESSFULLY GENERATED AND SAVED!")
