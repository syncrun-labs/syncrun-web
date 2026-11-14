import { renderShareImage, shareImageSize } from "@/src/site/share-image";

export const size = shareImageSize;
export const contentType = "image/png";
export const alt = "SyncRun 크루 초대";

export default function Image() {
  return renderShareImage("ko", true);
}
