#!/bin/sh
# 장면 클립 → 스크롤 스크러빙용 프레임 시퀀스.
#
# 패널 배경 영상은 <video> 가 아니라 프레임 시퀀스를 캔버스에 그린다(ScrubFrames) — 디코더가 키프레임 사이를
# 뛰지 못해 스크롤 위치에 맞는 장면을 짚을 수 없어서다(docs/adr/0003).
#
#   [REVERSE=1] sh scripts/scene-frames.sh <클립.mp4> <이름> [FPS=12] [W=1280] [Q=70]
#
# REVERSE=1 은 거꾸로 뽑는다 — "사진에서 손이 빠져나가는" 클립을 뒤집어 "손이 들어와 사진이 되는" 장면을 만든다.
# 생성 모델은 시작 장면을 사진에 맞추는 편이 끝 장면을 맞추는 것보다 안정적이다.
#
# 산출물: public/scenes/<이름>/f-0000.webp … · public/scenes/<이름>/manifest.json({ frames, width, height })
set -eu
SRC="$1"
NAME="$2"
FPS="${FPS:-12}"
W="${W:-1280}"
Q="${Q:-70}"
REV=""
[ "${REVERSE:-}" = 1 ] && REV=",reverse"
OUT="public/scenes/$NAME"
rm -rf "$OUT"
mkdir -p "$OUT"
# ffmpeg 빌드에 libwebp 가 없을 수 있어 PNG 로 뽑고 cwebp 로 굽는다
TMP="$OUT/.png"
mkdir -p "$TMP"
ffmpeg -v error -y -i "$SRC" -an -vf "fps=$FPS,scale=$W:-2:flags=lanczos$REV" "$TMP/%04d.png"
i=0
for f in $(ls "$TMP"/*.png | sort); do
  cwebp -quiet -q "$Q" -m 6 "$f" -o "$OUT/f-$(printf %04d $i).webp"
  i=$((i + 1))
done
rm -rf "$TMP"
H=$(python3 -c "from PIL import Image; print(Image.open('$OUT/f-0000.webp').height)")
printf '{ "frames": %d, "width": %d, "height": %d }\n' "$i" "$W" "$H" > "$OUT/manifest.json"
echo "$OUT: $i frames, $(du -sh "$OUT" | cut -f1)"
