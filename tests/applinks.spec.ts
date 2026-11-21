import { expect, test } from "@playwright/test";

test("Android 앱 링크 연결 파일은 앱 패키지와 Play 서명 지문을 낸다", async ({ request }) => {
  const response = await request.get("/.well-known/assetlinks.json", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(await response.json()).toEqual([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.syncrunlabs.sync",
        sha256_cert_fingerprints: [
          "C0:8F:45:D1:71:92:E6:0F:71:79:B0:D0:64:9D:EF:8E:3E:BE:7A:43:D9:A0:81:7E:B1:E2:2A:70:BC:A5:1B:96",
        ],
      },
    },
  ]);
});
