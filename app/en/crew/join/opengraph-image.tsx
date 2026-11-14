import { renderShareImage, shareImageSize } from "@/src/site/share-image";

export const size = shareImageSize;
export const contentType = "image/png";
export const alt = "SyncRun crew invitation";

export default function Image() {
  return renderShareImage("en", true);
}
