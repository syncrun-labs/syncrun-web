/* 지원 페이지 카피 — 한국어/영어. 사실관계(맞댐 조건·권한 문구·계정 삭제 경로)는 syncrun-ios의
   권한 설명과 앱 화면을 따른다. 두 언어의 절 구성이 같아야 토글이 같은 자리를 보여 준다. */

import type { Lang } from "./dict";
import type { PageMeta } from "./lang";

export interface SupportCopy {
  meta: PageMeta;
  nav: { home: string; company: string; cta: string };
  head: { title: string; lede: string; requirements: string };
  contact: { label: string; note: string; sideLabel: string; checklist: string[] };
  faq: { heading: string; items: { q: string; a: string[] }[] };
  permissions: {
    heading: string;
    lede: string;
    items: { name: string; use: string; off: string }[];
  };
  account: { heading: string; cards: { h: string; parts: string[]; link?: string }[] };
  foot: { home: string; company: string; legal: string; contact: string; github: string };
}

export const supportCopy: Record<Lang, SupportCopy> = {
  ko: {
    meta: {
      title: "SyncRun 지원 — 문의와 도움말",
      description:
        "SyncRun iOS 앱의 지원 페이지. 폰 맞댐 결성, 위치·건강 권한, 계정과 회원 탈퇴, 문의 방법을 안내합니다.",
    },
    nav: { home: "홈", company: "회사 소개", cta: "문의하기" },
    head: {
      title: "지원",
      lede: "맞대면 그 자리에서 함께 뛰는 러닝 앱, SyncRun. 자주 막히는 지점과 문의 방법을 이 한 페이지에 모았습니다.",
      requirements: "iOS 18.0 이상 · Apple Watch는 watchOS 11.0 이상(선택) · 앱 버전 1.0.0",
    },
    contact: {
      label: "문의",
      note: "한국어와 영어로 답변드리며, 보통 2~3 영업일 안에 회신합니다.",
      sideLabel: "이렇게 적어 주시면 빠릅니다",
      checklist: [
        "기기 모델 (예: iPhone 15 Pro)",
        "iOS 버전과 앱 버전",
        "문제가 생긴 시각과 화면",
        "혼자 달리던 중인지, 맞댐으로 함께 달리던 중인지",
      ],
    },
    faq: {
      heading: "자주 묻는 질문",
      items: [
        {
          q: "폰을 맞대도 그룹이 만들어지지 않아요",
          a: [
            "맞댐은 UWB(초광대역) 칩이 있는 iPhone끼리만 동작합니다. iPhone 11 이후 모델(SE 제외)이 여기 해당하고, 그 밖의 기기에서는 맞댐이 나타나지 않습니다.",
            "두 사람 모두 앱의 홈 화면에 있어야 하고, 두 기기를 20cm 안쪽으로 0.4초 정도 붙인 채 유지하면 자동으로 같은 세션에 들어갑니다. 흔들거나 부딪칠 필요는 없습니다.",
            "처음 맞댈 때 뜨는 '근처 기기'와 '로컬 네트워크' 권한을 모두 허용해야 합니다. 실수로 거절했다면 iOS 설정 > SyncRun에서 다시 켤 수 있습니다.",
            "카운트다운이 시작된 뒤에는 새로 합류할 수 없습니다. 출발 전 홈 화면에서 맞대 주세요.",
          ],
        },
        {
          q: "화면을 끄면 거리가 멈추거나 경로가 끊깁니다",
          a: [
            "위치 권한이 '앱을 사용하는 동안'으로 허용되어 있고 '정확한 위치'가 켜져 있어야 합니다. iOS 설정 > SyncRun > 위치에서 확인해 주세요.",
            "저전력 모드는 위치 갱신 주기를 늦춥니다. 긴 러닝에서는 꺼 두는 편이 정확합니다.",
            "지하 구간이나 고층 건물 사이에서는 GPS 신호 자체가 흔들려 경로가 튈 수 있습니다. 다시 열린 하늘 아래로 나오면 이어서 기록됩니다.",
          ],
        },
        {
          q: "심박수가 빈칸으로 나옵니다",
          a: [
            "심박수는 Apple Watch(watchOS 11 이상) 또는 심박 측정을 지원하는 이어폰이 연결돼 있을 때 기록됩니다.",
            "심박은 민감정보라 별도 동의를 받습니다. '나' 탭에서 건강정보 수집 동의를 켜고, 건강 앱의 SyncRun 읽기 권한도 허용해 주세요.",
          ],
        },
        {
          q: "러닝이 건강 앱에 저장되지 않아요",
          a: [
            "완료한 러닝은 건강 앱에 운동으로 저장됩니다. iOS 설정 > 건강 > 데이터 접근 및 기기 > SyncRun에서 쓰기 권한이 켜져 있는지 확인해 주세요.",
          ],
        },
        {
          q: "러닝 카드를 사진으로 저장할 수 없습니다",
          a: [
            "카드 이미지와 경로 리플레이 영상은 저장을 누르는 순간에만 사진 앱에 추가됩니다. 저장이 안 되면 iOS 설정 > SyncRun > 사진에서 '추가만' 이상으로 허용해 주세요.",
          ],
        },
        {
          q: "기록이 사라졌거나, 새 기기에서 예전 기록이 보이지 않습니다",
          a: [
            "기록은 기기에 먼저 저장되고 이어서 계정에 동기화됩니다. 네트워크가 끊겨 있었다면 앱을 다시 열었을 때 밀린 기록이 함께 올라갑니다.",
            "같은 Apple 계정으로 로그인하면 서버에 있는 기록을 다시 내려받습니다. 다른 Apple 계정으로 로그인하면 기록도 다릅니다.",
          ],
        },
        {
          q: "로그인은 어떻게 하나요",
          a: [
            "로그인 경로는 Apple로 계속하기 하나입니다. 이메일과 비밀번호로 가입하는 방법은 없고, 따라서 비밀번호를 잊을 일도 없습니다.",
            "기기를 바꾸거나 앱을 지웠다 다시 설치해도 같은 Apple 계정으로 로그인하면 이름·사진·설정과 기록이 복원됩니다.",
          ],
        },
        {
          q: "같이 뛰는 사람에게 내 위치를 보이고 싶지 않습니다",
          a: [
            "'나' 탭 설정에서 라이브 위치 공유를 끄면 세션 지도에 내 위치가 올라가지 않습니다. 러닝 중에도 언제든 끌 수 있습니다.",
            "경로 라인만 남기기, 장소를 동 단위로만 표기하기, 위치 수집 자체를 일시중지하기도 같은 설정에 있습니다.",
            "위치는 참가 중인 세션의 러너에게만 공유되며, 러닝이 끝나면 실시간 공유도 끝납니다.",
          ],
        },
        {
          q: "계정을 지우고 싶습니다",
          a: [
            "'나' 탭 > 계정 관리 > 회원 탈퇴에서 직접 삭제할 수 있습니다. 서버 계정과 모든 러닝 기록이 함께 지워지고 되돌릴 수 없습니다.",
            "로그아웃은 계정을 지우지 않고 이 기기에서만 나갑니다.",
          ],
        },
      ],
    },
    permissions: {
      heading: "권한 안내",
      lede: "SyncRun이 요청하는 권한과, 허용하지 않았을 때 달라지는 점입니다. 모든 권한은 iOS 설정 > SyncRun에서 언제든 바꿀 수 있습니다.",
      items: [
        {
          name: "위치 (앱을 사용하는 동안)",
          use: "경로와 거리를 측정합니다. 화면이 꺼져 있어도 러닝 중에는 계속 기록합니다.",
          off: "러닝을 기록할 수 없습니다",
        },
        {
          name: "근처 기기 (Nearby Interaction)",
          use: "폰을 맞댈 때 두 기기 사이의 정확한 거리를 잽니다. 맞대는 순간에만 씁니다.",
          off: "맞댐으로 그룹을 만들 수 없습니다",
        },
        {
          name: "로컬 네트워크",
          use: "맞댄 상대의 기기를 같은 네트워크에서 확인합니다.",
          off: "맞댐으로 그룹을 만들 수 없습니다",
        },
        {
          name: "동작 및 피트니스",
          use: "페이스와 케이던스를 계산합니다.",
          off: "케이던스가 표시되지 않습니다",
        },
        {
          name: "건강 (읽기)",
          use: "러닝 중 심박수를 읽어 기록에 함께 남깁니다.",
          off: "심박수 자리가 비워집니다",
        },
        {
          name: "건강 (쓰기)",
          use: "완료한 러닝을 건강 앱에 운동으로 저장합니다.",
          off: "건강 앱에 운동이 남지 않습니다",
        },
        {
          name: "사진 추가",
          use: "러닝 카드 이미지나 리플레이 영상을 저장할 때만 사진 앱에 추가합니다.",
          off: "카드를 사진으로 저장할 수 없습니다",
        },
        {
          name: "알림",
          use: "함께 뛰는 그룹과 세션 상태를 알려 줍니다.",
          off: "알림이 오지 않습니다",
        },
      ],
    },
    account: {
      heading: "계정과 개인정보",
      cards: [
        {
          h: "계정 삭제",
          parts: [
            "앱의 ‘나’ 탭 > 계정 관리 > 회원 탈퇴에서 직접 삭제할 수 있습니다. 서버 계정과 모든 러닝 기록이 함께 지워지며 되돌릴 수 없습니다. 앱에 접근할 수 없는 상황이라면 지원 메일로 요청해 주세요.",
          ],
        },
        {
          h: "약관과 처리방침",
          parts: [
            "이용약관, 개인정보 처리방침, 위치기반서비스 이용약관 전문은 ",
            " 페이지에서 볼 수 있고, 앱 첫 실행의 동의 화면과 ‘나’ 탭 > 계정 관리에서도 열람할 수 있습니다.",
          ],
          link: "약관 및 정책",
        },
        {
          h: "위치와 건강정보",
          parts: [
            "실시간 위치는 참가 중인 세션의 러너에게만 공유되고 러닝이 끝나면 멈춥니다. 심박수는 별도 동의를 받은 경우에만 수집하며, 두 가지 모두 ‘나’ 탭 설정에서 끌 수 있습니다.",
          ],
        },
      ],
    },
    foot: { home: "홈", company: "회사 소개", legal: "약관", contact: "문의", github: "GitHub" },
  },

  en: {
    meta: {
      title: "SyncRun Support — Help and contact",
      description:
        "Support for the SyncRun iOS app: forming a group by tapping phones, location and health permissions, accounts and deletion, and how to reach us.",
    },
    nav: { home: "Home", company: "About", cta: "Contact us" },
    head: {
      title: "Support",
      lede: "SyncRun is a running app where you tap phones and run together on the spot. This page collects what people get stuck on, and how to reach us.",
      requirements:
        "iOS 18.0 or later · Apple Watch needs watchOS 11.0 or later (optional) · App version 1.0.0",
    },
    contact: {
      label: "Contact",
      note: "We reply in English or Korean, usually within 2–3 business days.",
      sideLabel: "Telling us this makes it faster",
      checklist: [
        "Device model (e.g. iPhone 15 Pro)",
        "iOS version and app version",
        "When it happened and which screen you were on",
        "Whether you were running solo or in a group",
      ],
    },
    faq: {
      heading: "Frequently asked questions",
      items: [
        {
          q: "Tapping phones doesn’t create a group",
          a: [
            "Tap-to-pair works only between iPhones that have the ultra-wideband (UWB) chip — iPhone 11 and later, except the SE. On other devices the pairing never appears.",
            "Both people need to be on the app’s home screen. Hold the two phones within 20 cm of each other for about 0.4 seconds and you join the same session automatically. There is no need to shake or bump them.",
            "The first time you pair, allow both the Nearby Devices and Local Network prompts. If one was declined by accident, turn it back on in iOS Settings > SyncRun.",
            "Nobody can join after the countdown starts. Pair from the home screen before you set off.",
          ],
        },
        {
          q: "Distance stops or the route breaks when the screen turns off",
          a: [
            "Location must be allowed While Using the App with Precise Location on. Check iOS Settings > SyncRun > Location.",
            "Low Power Mode slows down location updates. For long runs it is more accurate with it off.",
            "Underground or between tall buildings the GPS signal itself wanders and the route can jump. Recording continues once you are back under open sky.",
          ],
        },
        {
          q: "Heart rate is blank",
          a: [
            "Heart rate is recorded when an Apple Watch (watchOS 11 or later) or heart-rate-capable earbuds are connected.",
            "Heart rate is sensitive data, so we ask for it separately. Turn on health data consent in the Me tab and allow SyncRun to read from the Health app.",
          ],
        },
        {
          q: "My run isn’t saved to the Health app",
          a: [
            "Finished runs are saved to Health as workouts. Check that write access is on in iOS Settings > Health > Data Access & Devices > SyncRun.",
          ],
        },
        {
          q: "I can’t save a run card to Photos",
          a: [
            "The card image and the route replay video are added to Photos only at the moment you tap save. If saving fails, allow at least “Add Photos Only” in iOS Settings > SyncRun > Photos.",
          ],
        },
        {
          q: "A run disappeared, or old runs don’t show on a new device",
          a: [
            "Runs are saved on the device first and then synced to your account. If the network was down, the pending runs upload the next time you open the app.",
            "Signing in with the same Apple Account downloads the runs held on the server. A different Apple Account has different runs.",
          ],
        },
        {
          q: "How do I sign in?",
          a: [
            "Sign in with Apple is the only way in. There is no email-and-password sign-up, so there is no password to forget.",
            "Change your phone or delete and reinstall the app, and signing in with the same Apple Account restores your name, photo, settings and runs.",
          ],
        },
        {
          q: "I don’t want the people I run with to see my location",
          a: [
            "Turn off live location sharing in the Me tab and your position no longer appears on the session map. You can turn it off mid-run too.",
            "Drawing the route line only, naming places down to the neighbourhood, and pausing location collection entirely are in the same settings.",
            "Location is shared only with runners in the session you are in, and live sharing ends when the run ends.",
          ],
        },
        {
          q: "I want to delete my account",
          a: [
            "Me tab > Account > Delete account removes it yourself. Your server account and every run go with it, and it cannot be undone.",
            "Signing out does not delete the account — it only signs you out on this device.",
          ],
        },
      ],
    },
    permissions: {
      heading: "Permissions",
      lede: "What SyncRun asks for, and what changes if you say no. Every permission can be changed at any time in iOS Settings > SyncRun.",
      items: [
        {
          name: "Location (While Using the App)",
          use: "Measures your route and distance. Recording continues during a run even with the screen off.",
          off: "Runs cannot be recorded",
        },
        {
          name: "Nearby Devices (Nearby Interaction)",
          use: "Measures the exact distance between two phones as you tap them together. Used only at that moment.",
          off: "Groups cannot be formed by tapping",
        },
        {
          name: "Local Network",
          use: "Confirms the other phone on the same network as you tap.",
          off: "Groups cannot be formed by tapping",
        },
        {
          name: "Motion & Fitness",
          use: "Calculates pace and cadence.",
          off: "Cadence is not shown",
        },
        {
          name: "Health (read)",
          use: "Reads heart rate during a run and keeps it with the record.",
          off: "Heart rate is left blank",
        },
        {
          name: "Health (write)",
          use: "Saves a finished run to the Health app as a workout.",
          off: "No workout is left in Health",
        },
        {
          name: "Add to Photos",
          use: "Adds a run card image or replay video to Photos only when you save one.",
          off: "Cards cannot be saved to Photos",
        },
        {
          name: "Notifications",
          use: "Tells you about your group and the state of the session.",
          off: "No notifications arrive",
        },
      ],
    },
    account: {
      heading: "Account and privacy",
      cards: [
        {
          h: "Deleting your account",
          parts: [
            "Me tab > Account > Delete account removes it yourself. Your server account and every run are deleted with it and cannot be recovered. If you cannot get into the app, email support and we will do it for you.",
          ],
        },
        {
          h: "Terms and policies",
          parts: [
            "The full Terms of Service, Privacy Policy and Location-Based Service Terms are on the ",
            " page, and also inside the app — on the consent screen at first launch and under Me > Account.",
          ],
          link: "Terms & policies",
        },
        {
          h: "Location and health data",
          parts: [
            "Live location is shared only with runners in the session you are in, and stops when the run ends. Heart rate is collected only with your separate consent. Both can be turned off in the Me tab.",
          ],
        },
      ],
    },
    foot: {
      home: "Home",
      company: "About",
      legal: "Legal",
      contact: "Contact",
      github: "GitHub",
    },
  },
};
