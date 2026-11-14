import { renderShareImage, shareImageSize } from "@/src/site/share-image";

export const size = shareImageSize;
export const contentType = "image/png";
export const alt = "SyncRun · 폰을 맞대면 바로 함께 뛰는 러닝 앱";

export default function Image() {
  return renderShareImage("ko");
}
