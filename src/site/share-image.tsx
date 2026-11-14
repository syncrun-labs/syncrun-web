import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { crewJoinCopy } from "../i18n/crewJoin";
import { productCopy } from "../i18n/product";
import type { Lang } from "../i18n/dict";

export const shareImageSize = { width: 1200, height: 630 };

export async function renderShareImage(lang: Lang, crew = false) {
  const title = crew ? [crewJoinCopy[lang].label] : productCopy[lang].hero.title;
  const [font, wordmark, live] = await Promise.all([
    readFile(join(process.cwd(), "src/site/fonts/NotoSansKR-Share.ttf")),
    readFile(join(process.cwd(), "public/brand/wordmark.png")),
    crew ? null : readFile(join(process.cwd(), "public/product/live.jpg")),
  ]);

  /* Noto Sans KR의 라틴·한글 부분집합은 빌드에서 공유 이미지를 그릴 때만 쓴다. */
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "64px 82px",
        justifyContent: crew ? "center" : "space-between",
        alignItems: "center",
        background: "#ffffff",
        color: "#0b0b0f",
        fontFamily: "Noto Sans KR",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: crew ? "center" : "flex-start", gap: 46 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse는 원시 이미지 요소를 사용한다 */}
        <img src={`data:image/png;base64,${wordmark.toString("base64")}`} width={221} height={76} alt="SyncRun" />
        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, fontWeight: 700, lineHeight: 1.16 }}>
          {title.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        {crew && <div style={{ display: "flex", fontSize: 36, color: "#d23d42" }}>{crewJoinCopy[lang].open}</div>}
      </div>
      {live && (
        <div style={{ display: "flex", padding: 8, borderRadius: 36, background: "#0b0b0f" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse는 원시 이미지 요소를 사용한다 */}
          <img
            src={`data:image/jpeg;base64,${live.toString("base64")}`}
            width={234}
            height={468}
            style={{ borderRadius: 28 }}
            alt=""
          />
        </div>
      )}
    </div>,
    { ...shareImageSize, fonts: [{ name: "Noto Sans KR", data: font, weight: 700 }] },
  );
}
