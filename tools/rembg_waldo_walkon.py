from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image
from rembg import new_session, remove


def trim_alpha(frames: list[Path], out_dir: Path, poster: Path) -> None:
    boxes: list[tuple[int, int, int, int]] = []
    images: list[Image.Image] = []

    for frame_path in frames:
        image = Image.open(frame_path).convert("RGBA")
        images.append(image)
        box = image.getchannel("A").getbbox()
        if box:
            boxes.append(box)

    if not boxes:
        raise SystemExit("No non-transparent pixels found in segmented frames")

    left = max(min(box[0] for box in boxes) - 24, 0)
    top = max(min(box[1] for box in boxes) - 24, 0)
    right = min(max(box[2] for box in boxes) + 24, images[0].width)
    bottom = min(max(box[3] for box in boxes) + 24, images[0].height)

    if (right - left) % 2:
        right = min(right + 1, images[0].width)
    if (bottom - top) % 2:
        bottom = min(bottom + 1, images[0].height)

    poster_saved = False
    for index, image in enumerate(images, start=1):
        cropped = image.crop((left, top, right, bottom))
        cropped.save(out_dir / f"alpha-{index:04d}.png")
        if not poster_saved and cropped.getchannel("A").getbbox():
            cropped.save(poster)
            poster_saved = True

    print(f"crop={left},{top},{right},{bottom}")
    print(f"frames={len(images)}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frames", required=True, type=Path)
    parser.add_argument("--work", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--poster", required=True, type=Path)
    args = parser.parse_args()

    source_frames = sorted(args.frames.glob("frame-*.png"))
    if not source_frames:
        raise SystemExit(f"No source frames found in {args.frames}")

    args.work.mkdir(parents=True, exist_ok=True)
    args.out.mkdir(parents=True, exist_ok=True)

    session = new_session("u2net_human_seg")
    segmented_paths: list[Path] = []
    for index, source in enumerate(source_frames, start=1):
        target = args.work / f"seg-{index:04d}.png"
        with Image.open(source) as frame:
            output = remove(
                frame.convert("RGB"),
                session=session,
                alpha_matting=True,
                alpha_matting_foreground_threshold=240,
                alpha_matting_background_threshold=10,
                alpha_matting_erode_size=10,
            )
        output.save(target)
        segmented_paths.append(target)
        if index % 25 == 0:
            print(f"segmented={index}/{len(source_frames)}", flush=True)

    trim_alpha(segmented_paths, args.out, args.poster)


if __name__ == "__main__":
    main()
