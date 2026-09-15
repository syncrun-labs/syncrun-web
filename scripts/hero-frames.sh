#!/bin/sh
# 히어로 배경 프레임 시퀀스 파이프라인.
#
# 히어로는 스크롤이 프레임을 넘기는 스크러빙 배경이다(docs/adr/0003). <video> 는 스크롤 위치로
# 프레임을 정확히 짚지 못하므로 — 디코더가 키프레임 사이를 못 뛴다 — 시퀀스를 미리 뽑아 캔버스에 그린다.
#
# 세 클립을 서사 순서(달려온다 → 만나서 맞댄다 → 함께 간다)로 크로스페이드해 잇는다.
# 루프가 아니라 한 방향이다 — 스크롤은 되감아도 같은 길을 되짚을 뿐 처음으로 이어지지 않는다.
#
# 블러와 톤은 인코딩 단계에서 굽는다. 런타임 filter: blur() 는 프레임마다 비싸고,
# 블러가 구워진 프레임은 고주파 성분이 없어 WebP 가 8KB 로 떨어진다(선명한 원본은 29KB).
#
#   SRC=<클립 폴더> OUT=<출력 폴더> [FPS=12] [W=960] [SIGMA=5] sh scripts/hero-frames.sh
#
# 산출물: <OUT>/seq/f-0000.webp … · <OUT>/poster.webp · <OUT>/manifest.json
set -eu
: "${SRC:?클립 폴더}"
: "${OUT:?출력 폴더}"
FPS="${FPS:-12}"
W="${W:-960}"
H="${H:-624}"
SIGMA="${SIGMA:-5}"
WORK="$OUT/.work"
rm -rf "$WORK" "$OUT/seq"
mkdir -p "$WORK" "$OUT/seq"

S1="$SRC/Runners_approaching_junction_on_…_20260915165305.mp4"
S2="$SRC/modified-Two_runners_stopping_at_junction_20260915165425_20260915171113.mp4"
S3="$SRC/Runners_starting_along_waterfron…_1080p_20260915165709.mp4"

# 생성 영상의 워터마크는 가로 89% 지점부터 우하단에 있다. 오른쪽 13.3% 를 걷어낸다.
CROP="crop=in_w*0.867:in_h:0:0"

dur() { ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$1"; }
norm() { ffmpeg -v error -y $2 -i "$1" -an -vf "$CROP,scale=$W:$H,fps=$FPS,format=yuv420p" -c:v libx264 -crf 12 -preset fast "$3"; }

# 1) 정규화 — S2 는 달려오는 앞부분(40프레임)을 잘라내고 만남부터 시작한다
norm "$S1" ""           "$WORK/n1.mp4"
norm "$S2" "-ss 1.6667" "$WORK/n2.mp4"
norm "$S3" ""           "$WORK/n3.mp4"

# 2) 1초 크로스페이드로 잇는다 — 한 방향이라 끝을 처음으로 되돌리지 않는다
D1=$(dur "$WORK/n1.mp4"); D2=$(dur "$WORK/n2.mp4")
O1=$(python3 -c "print($D1-1)")
O2=$(python3 -c "print($D1+$D2-2)")
ffmpeg -v error -y -i "$WORK/n1.mp4" -i "$WORK/n2.mp4" -i "$WORK/n3.mp4" -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=1:offset=$O1[a];[a][2:v]xfade=transition=fade:duration=1:offset=$O2[v]" \
  -map "[v]" -c:v libx264 -crf 12 -preset fast "$WORK/seq.mp4"

# 3) 노이즈 제거 → 가우시안 블러 → 살짝 어둡게
ffmpeg -v error -y -i "$WORK/seq.mp4" -vf "hqdn3d=3:3:6:6,gblur=sigma=$SIGMA,eq=brightness=-0.03:saturation=0.92" \
  -c:v libx264 -crf 12 -preset fast "$WORK/graded.mp4"

# 4) 프레임 추출 → WebP. 블러 프레임이라 q65 와 q50 의 용량 차이가 없다 — q65 를 쓴다
ffmpeg -v error -y -i "$WORK/graded.mp4" "$WORK/png/f-%04d.png" 2>/dev/null || {
  mkdir -p "$WORK/png"
  ffmpeg -v error -y -i "$WORK/graded.mp4" "$WORK/png/f-%04d.png"
}
i=0
for f in "$WORK"/png/f-*.png; do
  cwebp -quiet -q 65 -m 6 "$f" -o "$(printf '%s/seq/f-%04d.webp' "$OUT" "$i")"
  i=$((i + 1))
done

# 5) 포스터 — 시퀀스가 오기 전과 축소 모션에서 쓴다. 첫 프레임이다
cwebp -quiet -q 80 -m 6 "$WORK/png/f-0001.png" -o "$OUT/poster.webp"

# 6) 매니페스트 — 컴포넌트가 프레임 수를 하드코딩하지 않는다
printf '{\n  "frames": %d,\n  "width": %d,\n  "height": %d,\n  "fps": %d\n}\n' "$i" "$W" "$H" "$FPS" > "$OUT/manifest.json"

rm -rf "$WORK"
echo "프레임 ${i}장 · $(du -sh "$OUT/seq" | cut -f1) · 장당 약 $(($(du -sk "$OUT/seq" | cut -f1) / i))KB"
