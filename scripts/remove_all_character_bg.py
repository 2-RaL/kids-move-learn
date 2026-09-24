"""
Batch background remover for all character sprites using rembg.
Outputs transparent .png images for every character pose.
"""
import os
import glob
from rembg import remove, new_session
from PIL import Image

CHAR_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "assets", "characters")

def main():
    jpg_files = glob.glob(os.path.join(CHAR_DIR, "*.jpg"))
    print(f"Found {len(jpg_files)} character jpg images to convert to transparent PNGs...")
    
    # Use preloaded session for fast reuse
    session = new_session("bria-rmbg")

    for i, jpg_path in enumerate(jpg_files, 1):
        base_name = os.path.splitext(os.path.basename(jpg_path))[0]
        png_path = os.path.join(CHAR_DIR, f"{base_name}.png")
        
        # Check if already processed and valid
        if os.path.exists(png_path) and os.path.getsize(png_path) > 10000:
            print(f"[{i}/{len(jpg_files)}] Skipping (already exists): {base_name}.png")
            continue
            
        print(f"[{i}/{len(jpg_files)}] Removing background: {base_name}.jpg -> {base_name}.png ...")
        try:
            with Image.open(jpg_path) as inp:
                out = remove(inp, session=session)
                out.save(png_path, format="PNG")
            print(f"  OK: {base_name}.png ({os.path.getsize(png_path)} bytes)")
        except Exception as e:
            print(f"  ERROR processing {base_name}: {e}")

    print("\nAll character sprites converted to transparent PNGs successfully!")

if __name__ == "__main__":
    main()
