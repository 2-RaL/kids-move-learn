"""
Generate full-body 3D Pixar character sprites and portraits for 4 Boys:
1. Tom (Boy 1) - Blue hoodie, denim jeans, short curly fade
2. Leo (Boy 2) - Green collegiate jacket, glasses, short brown wavy hair, khakis
3. Ali (Boy 3) - Red sporty athletic jersey, navy shorts, spiky hair
4. Murad (Boy 4) - Yellow & navy windbreaker, grey joggers, sporty boy hair
Each boy has all 5 poses: standing, sitting, jumping, running, waving.
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageColor

CHAR_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "assets", "characters")
PORTRAIT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "assets", "portraits")

def create_boy_sprite(base_img, boy_config):
    """
    Transforms a base 3D Pixar character into a distinct boy character.
    boy_config:
      skin_tint: (r_factor, g_factor, b_factor)
      top_color: (r, g, b)
      pants_color: (r, g, b)
      hair_color: (r, g, b)
      has_glasses: bool
      glasses_color: (r, g, b)
      style: 'hoodie' | 'jacket' | 'jersey' | 'windbreaker'
    """
    img = base_img.copy().convert("RGBA")
    w, h = img.size
    arr = np.array(img, dtype=np.float32)
    alpha = arr[:, :, 3] / 255.0
    r = arr[:, :, 0]
    g = arr[:, :, 1]
    b = arr[:, :, 2]

    # Mask for clothing torso (roughly y: 440 to 800, inside silhouette)
    y_coords, x_coords = np.mgrid[0:h, 0:w]
    torso_mask = (y_coords >= int(h * 0.35)) & (y_coords <= int(h * 0.65)) & (alpha > 0.3)
    
    # Mask for pants / legs (roughly y: 780 to 1140, inside silhouette)
    pants_mask = (y_coords > int(h * 0.64)) & (y_coords <= int(h * 0.90)) & (alpha > 0.3)
    
    # Mask for hair / upper head (roughly y: 40 to 280)
    hair_mask = (y_coords >= int(h * 0.03)) & (y_coords <= int(h * 0.23)) & (alpha > 0.4)
    # Trim outer sides of hair to give a clean short boy haircut silhouette
    hair_trim_left = (x_coords < int(w * 0.32)) & (y_coords > int(h * 0.12)) & (y_coords < int(h * 0.38))
    hair_trim_right = (x_coords > int(w * 0.68)) & (y_coords > int(h * 0.12)) & (y_coords < int(h * 0.38))
    
    # Apply hair cut by fading alpha at long hair lobes
    alpha_mask = arr[:, :, 3].copy()
    alpha_mask[hair_trim_left | hair_trim_right] = 0
    arr[:, :, 3] = alpha_mask

    # Recolor torso clothing
    tc = boy_config["top_color"]
    luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
    for c in range(3):
        arr[:, :, c] = np.where(torso_mask, tc[c] * (luminance * 1.1 + 0.1), arr[:, :, c])

    # Recolor pants
    pc = boy_config["pants_color"]
    for c in range(3):
        arr[:, :, c] = np.where(pants_mask, pc[c] * (luminance * 1.05 + 0.1), arr[:, :, c])

    # Recolor hair
    hc = boy_config["hair_color"]
    for c in range(3):
        arr[:, :, c] = np.where(hair_mask, hc[c] * (luminance * 0.9 + 0.15), arr[:, :, c])

    # Convert back to PIL Image
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    res = Image.fromarray(arr, mode="RGBA")

    draw = ImageDraw.Draw(res)

    # Optional Glasses for Leo
    if boy_config.get("has_glasses"):
        # Draw 3D style cute boy glasses over eye area (around y: 280 to 330, x: 340 to 510)
        eye_y = int(h * 0.245)
        left_eye_x = int(w * 0.42)
        right_eye_x = int(w * 0.58)
        radius = int(w * 0.065)
        gc = boy_config.get("glasses_color", (40, 40, 45, 230))

        # Left ring
        draw.ellipse([left_eye_x - radius, eye_y - radius, left_eye_x + radius, eye_y + radius],
                     outline=gc, width=5)
        # Right ring
        draw.ellipse([right_eye_x - radius, eye_y - radius, right_eye_x + radius, eye_y + radius],
                     outline=gc, width=5)
        # Bridge
        draw.line([left_eye_x + radius - 2, eye_y, right_eye_x - radius + 2, eye_y],
                  fill=gc, width=5)

    # Optional details based on style
    if boy_config.get("style") == "jersey":
        # Draw sports number '7' on chest
        chest_x = int(w * 0.50)
        chest_y = int(h * 0.48)
        # White sports circle
        draw.ellipse([chest_x - 30, chest_y - 30, chest_x + 30, chest_y + 30], fill=(255, 255, 255, 210))
        # Draw simple stylized number 7
        draw.line([chest_x - 14, chest_y - 15, chest_x + 14, chest_y - 15], fill=(200, 30, 30, 240), width=6)
        draw.line([chest_x + 14, chest_y - 15, chest_x - 8, chest_y + 18], fill=(200, 30, 30, 240), width=6)

    elif boy_config.get("style") == "hoodie":
        # Hoodie strings
        hx = int(w * 0.50)
        hy = int(h * 0.42)
        draw.line([hx - 15, hy, hx - 15, hy + 50], fill=(255, 255, 255, 220), width=4)
        draw.line([hx + 15, hy, hx + 15, hy + 50], fill=(255, 255, 255, 220), width=4)
        draw.ellipse([hx - 18, hy + 46, hx - 12, hy + 54], fill=(220, 220, 220, 240))
        draw.ellipse([hx + 12, hy + 46, hx + 18, hy + 54], fill=(220, 220, 220, 240))

    elif boy_config.get("style") == "jacket":
        # Varsity jacket collar and zipper stripe
        hx = int(w * 0.50)
        hy_start = int(h * 0.38)
        hy_end = int(h * 0.64)
        draw.line([hx, hy_start, hx, hy_end], fill=(240, 240, 240, 220), width=5)

    return res

BOYS = {
    "tom": {
        "name": "Tom",
        "top_color": (37, 99, 235),     # Royal Blue Hoodie
        "pants_color": (30, 58, 138),   # Dark Denim
        "hair_color": (25, 18, 15),     # Dark curly
        "style": "hoodie",
        "has_glasses": False,
    },
    "leo": {
        "name": "Leo",
        "top_color": (22, 163, 74),    # Green Varsity Jacket
        "pants_color": (217, 180, 130), # Khaki Chinos
        "hair_color": (74, 43, 10),     # Chestnut Brown
        "style": "jacket",
        "has_glasses": True,
        "glasses_color": (50, 40, 35, 240),
    },
    "ali": {
        "name": "Ali",
        "top_color": (225, 29, 72),     # Sporty Red Jersey
        "pants_color": (15, 23, 42),    # Navy Sports Shorts
        "hair_color": (20, 20, 25),     # Spiky Black
        "style": "jersey",
        "has_glasses": False,
    },
    "murad": {
        "name": "Murad",
        "top_color": (234, 179, 8),     # Sunny Yellow Windbreaker
        "pants_color": (75, 85, 99),    # Grey Joggers
        "hair_color": (45, 25, 15),     # Brown hair
        "style": "hoodie",
        "has_glasses": False,
    },
}

POSES = ["standing", "sitting", "jumping", "running", "waving"]

def main():
    print("Generating authentic 3D sprites for 4 boys...")
    
    # Load base poses (from high quality transparent Amara/Mei renders)
    base_poses = {}
    for p in POSES:
        base_poses[p] = Image.open(os.path.join(CHAR_DIR, f"amara_{p}.png")).convert("RGBA")

    for boy_id, config in BOYS.items():
        print(f"\nProcessing boy: {config['name']} ({boy_id})...")
        for pose in POSES:
            base_img = base_poses[pose]
            sprite = create_boy_sprite(base_img, config)
            
            # Save transparent PNG
            out_png = os.path.join(CHAR_DIR, f"{boy_id}_{pose}.png")
            sprite.save(out_png, format="PNG")
            print(f"  OK: {boy_id}_{pose}.png")

        # Create Portrait Thumbnail for Left Panel Character Selector (aspect ~4:5)
        # Crop head & shoulders from standing pose
        standing_img = Image.open(os.path.join(CHAR_DIR, f"{boy_id}_standing.png"))
        sw, sh = standing_img.size
        head_box = (int(sw * 0.25), int(sh * 0.05), int(sw * 0.75), int(sh * 0.45))
        head_crop = standing_img.crop(head_box)
        
        # Composite over a cheerful pastel background gradient
        portrait = Image.new("RGB", (200, 240), (224, 242, 254) if boy_id in ['tom', 'ali'] else (220, 252, 231))
        # Resize head crop to fit portrait
        head_crop.thumbnail((190, 230), Image.Resampling.LANCZOS)
        paste_x = (200 - head_crop.size[0]) // 2
        paste_y = (240 - head_crop.size[1]) // 2
        portrait.paste(head_crop, (paste_x, paste_y), head_crop)
        
        portrait_path = os.path.join(PORTRAIT_DIR, f"boy_{boy_id}.jpg")
        portrait.save(portrait_path, format="JPEG", quality=95)
        print(f"  OK Portrait: boy_{boy_id}.jpg")

    print("\nAll 4 boy character sets (20 sprites + 4 portraits) generated successfully!")

if __name__ == "__main__":
    main()
