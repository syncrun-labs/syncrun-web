import { describe, expect, it } from "vitest";
import { EMPTY_FORM, describeSegment, isAllowedUrl, toInput, validate, type ComposeForm } from "./campaign";
import { countChars, seoulLocalToIso } from "./format";
import { maskEmail } from "./mask";

const filled: ComposeForm = {
  ...EMPTY_FORM,
  titleKo: "점검 안내",
  bodyKo: "새벽에 잠시 멈춰요",
  titleEn: "Maintenance",
  bodyEn: "Brief pause overnight",
};

describe("글자 수", () => {
  it("이모지와 결합 문자를 한 글자로 센다", () => {
    expect(countChars("👨‍👩‍👧")).toBe(1);
    expect(countChars("🏃🏻‍♀️달려요")).toBe(4);
    expect(countChars("한글")).toBe(2);
  });

  it("제목 40자는 통과, 41자는 막힌다", () => {
    expect(validate({ ...filled, titleKo: "가".repeat(40) }).titleKo).toBeUndefined();
    expect(validate({ ...filled, titleKo: "가".repeat(41) }).titleKo).toBe("40자까지예요");
  });

  it("이모지 40개 제목은 40자다", () => {
    expect(validate({ ...filled, titleKo: "🏃".repeat(40) }).titleKo).toBeUndefined();
  });

  it("공백만 있으면 비어 있는 것이다", () => {
    expect(validate({ ...filled, bodyEn: "   " }).bodyEn).toBe("영어 본문을 적어 주세요");
  });
});

describe("웹 페이지 이동", () => {
  it.each([
    ["https://syncrunlabs.com/event", true],
    ["https://www.syncrunlabs.com/a", true],
    ["http://www.syncrunlabs.com", false],
    ["https://syncrunlabs.com.evil.io", false],
    ["https://evilsyncrunlabs.com", false],
    ["javascript:alert(1)", false],
  ])("%s → %s", (url, ok) => {
    expect(isAllowedUrl(url)).toBe(ok);
  });

  it("웹 페이지를 고르면 주소가 필요하고, 다른 곳이면 주소를 싣지 않는다", () => {
    expect(validate({ ...filled, destination: "url" }).url).toBeDefined();
    expect(toInput({ ...filled, destination: "home", url: "https://x" })).not.toHaveProperty("url");
  });
});

describe("대상 한 줄", () => {
  it("빈 조건은 모든 이용자다", () => {
    expect(describeSegment({})).toBe("모든 이용자");
  });

  it("조건을 읽는 순서대로 잇는다", () => {
    expect(describeSegment({ platform: "ios", tiers: ["plus", "crew"], lastRun: { noneWithinDays: 14 } })).toBe(
      "iOS, Plus · Crew, 최근 14일 동안 안 뛴 사람",
    );
    expect(describeSegment({ userIds: ["a"] })).toBe("지정한 1명");
  });
});

describe("예약 시각", () => {
  it("한국 시간 입력을 UTC로 바꾼다", () => {
    expect(seoulLocalToIso("2026-10-20T10:00")).toBe("2026-10-20T01:00:00.000Z");
  });
});

describe("이메일 가림", () => {
  it.each([
    ["jihoon@gmail.com", "ji***@gmail.com"],
    ["ab@icloud.com", "***@icloud.com"],
    ["broken", "***"],
  ])("%s → %s", (email, masked) => {
    expect(maskEmail(email)).toBe(masked);
  });
});
