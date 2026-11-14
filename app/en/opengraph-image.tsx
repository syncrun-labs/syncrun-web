import { renderShareImage, shareImageSize } from "@/src/site/share-image";

export const size = shareImageSize;
export const contentType = "image/png";
export const alt = "SyncRun · Bring your phones together and run as a group";

export default function Image() {
  return renderShareImage("en");
}
