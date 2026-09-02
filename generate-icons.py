"""Generate RUSH extension icons: black background, white {R}, yellow accent."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent / "icons"
YELLOW = (255, 230, 0, 255)
BLACK = (0, 0, 0, 255)
WHITE = (255, 255, 255, 255)


def load_font(size: int):
    candidates = [
        "C:/Windows/Fonts/consolab.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/segoeuib.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), BLACK)
    draw = ImageDraw.Draw(img)

    accent = max(2, size // 10)
    draw.rectangle((size - accent, size - accent, size - 1, size - 1), fill=YELLOW)

    font_size = max(8, int(size * 0.42))
    font = load_font(font_size)
    text = "{R}"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) // 2 - bbox[0]
    y = (size - th) // 2 - bbox[1]
    draw.text((x, y), text, fill=WHITE, font=font)
    return img


def main():
    OUT.mkdir(exist_ok=True)
    for size, name in [(16, "icon16.png"), (48, "icon48.png"), (128, "icon128.png")]:
        icon = draw_icon(size)
        icon.save(OUT / name, format="PNG", optimize=True)
        print(f"Wrote {name} ({size}x{size})")


if __name__ == "__main__":
    main()
