#!/bin/sh
# 히어로 배경 영상 파이프라인.
# 세 클립을 1280×720·24fps로 맞추고 크로스페이드로 이어 붙인 뒤, 끝을 처음으로 다시 크로스페이드해
# 이음새 없는 루프를 만든다. 블러와 톤은 여기서 굽는다 — 런타임 CSS filter는 프레임마다 비싸다.
#
#   SRC=<클립 폴더> OUT=<출력 폴더> [SIGMA=7] sh scripts/hero-video.sh
#
# 산출물: dusk-loop.v1.mp4 · dusk-loop.v1.webm · dusk-poster.v1.webp
set -eu
: "${SRC:?클립 폴더}"
: "${OUT:?출력 폴더}"
SIGMA="${SIGMA:-7}"
WORK="$OUT/.work"
mkdir -p "$WORK" "$OUT"

S1="$SRC/Runners_approaching_junction_on_…_20260915165305.mp4"
S2="$SRC/modified-Two_runners_stopping_at_junction_20260915165425_20260915171113.mp4"
S3="$SRC/Runners_starting_along_waterfron…_1080p_20260915165709.mp4"

dur() { ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$1"; }
norm() { ffmpeg -v error -y $2 -i "$1" -an -vf "scale=1280:720,fps=24,format=yuv420p" -c:v libx264 -crf 12 -preset fast "$3"; }

# 1) 정규화 — S02는 달려오는 앞부분(40프레임)을 잘라내고 만남부터 시작한다
norm "$S1" ""            "$WORK/n1.mp4"
norm "$S2" "-ss 1.6667"  "$WORK/n2.mp4"
norm "$S3" ""            "$WORK/n3.mp4"

# 2) 1초 크로스페이드로 잇는다
D1=$(dur "$WORK/n1.mp4"); D2=$(dur "$WORK/n2.mp4")
O1=$(python3 -c "print($D1-1)")
O2=$(python3 -c "print($D1+$D2-2)")
ffmpeg -v error -y -i "$WORK/n1.mp4" -i "$WORK/n2.mp4" -i "$WORK/n3.mp4" -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=1:offset=$O1[a];[a][2:v]xfade=transition=fade:duration=1:offset=$O2[v]" \
  -map "[v]" -c:v libx264 -crf 12 -preset fast "$WORK/seq.mp4"

# 3) 끝을 처음으로 크로스페이드 — 마지막 프레임이 1초 지점과 같아져 루프가 이어진다
T=$(dur "$WORK/seq.mp4")
OL=$(python3 -c "print($T-2)")
ffmpeg -v error -y -i "$WORK/seq.mp4" -filter_complex \
  "[0:v]split[a][b];[a]trim=0:1,setpts=PTS-STARTPTS[head];[b]trim=1,setpts=PTS-STARTPTS[body];[body][head]xfade=transition=fade:duration=1:offset=$OL[v]" \
  -map "[v]" -c:v libx264 -crf 12 -preset fast "$WORK/loop.mp4"

# 4) 노이즈 제거 → 가우시안 블러 → 살짝 어둡게
ffmpeg -v error -y -i "$WORK/loop.mp4" -vf "hqdn3d=3:3:6:6,gblur=sigma=$SIGMA,eq=brightness=-0.05:saturation=0.9" \
  -c:v libx264 -crf 12 -preset fast "$WORK/graded.mp4"

# 5) 배포 인코딩 — 블러 영상은 극단적으로 잘 압축된다
ffmpeg -v error -y -i "$WORK/graded.mp4" -c:v libx264 -preset slow -crf 30 -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT/dusk-loop.v1.mp4"
ffmpeg -v error -y -i "$WORK/graded.mp4" -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 "$OUT/dusk-loop.v1.webm"

# 6) 포스터 — 루프 첫 프레임
ffmpeg -v error -y -i "$WORK/graded.mp4" -frames:v 1 -update 1 "$WORK/poster.png"
cwebp -quiet -q 80 -m 6 "$WORK/poster.png" -o "$OUT/dusk-poster.v1.webp"

echo "seq=${T}s loop=$(dur "$WORK/loop.mp4")s"
ls -la "$OUT"
