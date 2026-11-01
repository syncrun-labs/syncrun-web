/* 계정 삭제 안내 페이지 카피 — 한국어/영어. 탈퇴 경로와 지워지는 것의 사실관계는 syncrun-ios의
   계정 관리 화면과 허브 api-contract §4.5를 따른다. 두 언어의 절 구성이 같아야 토글이 같은 자리를 보여 준다. */

import type { Lang } from "./dict";
import type { PageMeta } from "./lang";

export interface AccountCopy {
  meta: PageMeta;
  nav: { home: string; support: string; cta: string };
  head: { title: string; lede: string };
  inApp: { heading: string; lede: string; steps: string[] };
  deleted: {
    heading: string;
    lede: string;
    cols: { h: string; items?: string[]; p: string }[];
  };
  device: { heading: string; lede: string; cols: { h: string; p: string }[] };
  subscription: { heading: string; lede: string; cols: { h: string; p: string }[] };
  records: { heading: string; lede: string; cols: { h: string; p: string }[] };
  email: {
    heading: string;
    lede: string;
    label: string;
    mailSubject: string;
    notePrefix: string;
    noteLink: string;
    noteSuffix: string;
    sideLabel: string;
    checklist: string[];
  };
  contact: { heading: string; prefix: string; link: string; suffix: string };
  foot: { home: string; support: string; legal: string; contact: string; github: string };
}

export const accountCopy: Record<Lang, AccountCopy> = {
  ko: {
    meta: {
      title: "계정 삭제 안내 · SyncRun",
      description:
        "SyncRun 계정을 앱에서 직접 삭제하는 방법, 삭제되는 것과 남는 것, 앱을 쓸 수 없을 때 이메일로 요청하는 방법을 안내합니다.",
    },
    nav: { home: "홈", support: "지원", cta: "문의하기" },
    head: {
      title: "계정 삭제 안내",
      lede: "SyncRun 계정은 앱에서 직접 지울 수 있습니다. 앱을 쓸 수 없다면 이메일로 요청할 수 있습니다. 무엇이 지워지고 무엇이 남는지도 여기에 적어 둡니다.",
    },
    inApp: {
      heading: "앱에서 바로 삭제하기",
      lede: "다섯 단계입니다. 마지막 확인을 누르면 삭제는 그 자리에서 이루어지고, 앱은 처음 화면으로 돌아갑니다.",
      steps: [
        "앱을 열고 「나」 탭으로 갑니다.",
        "「계정 관리」를 엽니다.",
        "「영구 삭제되는 것을 이해했어요」를 켭니다.",
        "「회원 탈퇴」를 누릅니다.",
        "확인 창에서 「회원 탈퇴」를 한 번 더 누릅니다.",
      ],
    },
    deleted: {
      heading: "삭제되는 것",
      lede: "회원 탈퇴는 서버의 계정과 데이터를 완전히 지웁니다.",
      cols: [
        {
          h: "서버에서 지워지는 것",
          items: [
            "계정과 러닝 기록 전체",
            "프로필 이름과 사진",
            "카드 배경 사진",
            "구독 정보",
            "크루 소속 · 출석 기록과 크루 초대 · 가입 요청",
            "기기 알림 토큰",
            "약관 동의 기록",
          ],
          p: "Apple로 로그인한 계정은 Apple ID 설정의 앱 연결도 함께 폐기됩니다.",
        },
        {
          h: "남는 것",
          p: "함께 뛴 사람의 기록에 남은 단체 결과는 그 사람의 기록이라 지워지지 않고, 이름은 러닝 당시의 이름으로 남습니다. 크루장이던 크루는 지워지지 않고 크루장 없이 읽기 전용이 되어 크루원이 이어받을 수 있습니다. 법령이 보존을 요구하는 기록은 그 기간 동안 보관한 뒤 지웁니다 — 위치정보 이용·제공사실 확인자료 6개월, 소비자 불만·분쟁 처리 기록 3년, 서비스 이용 로그 3개월.",
        },
        {
          h: "되돌릴 수 없습니다",
          p: "삭제한 계정은 되살릴 수 없습니다. 같은 Apple 계정이나 Google 계정으로 다시 로그인하면 빈 새 계정이 만들어집니다.",
        },
      ],
    },
    device: {
      heading: "기기에 남는 것",
      lede: "회원 탈퇴와 로그아웃은 기기에 남기는 것이 다릅니다.",
      cols: [
        {
          h: "탈퇴한 기기",
          p: "회원 탈퇴를 진행한 기기에서는 러닝 기록, 사진, 설정, 동기화 정보가 함께 지워집니다.",
        },
        {
          h: "다른 기기",
          p: "이메일로 요청해 삭제했거나 다른 기기에서 탈퇴했다면, 손에 있는 기기의 러닝 기록과 설정은 앱을 지우기 전까지 기기에 남습니다.",
        },
        {
          h: "로그아웃",
          p: "로그아웃은 계정을 지우지 않습니다. 이 기기에서 나갈 뿐이고, 기기의 러닝 기록은 그대로 남습니다.",
        },
      ],
    },
    subscription: {
      heading: "구독은 따로 해지해 주세요",
      lede: "회원 탈퇴는 구독 해지가 아닙니다. SyncRun Plus · Crew를 구독 중이라면 산 곳에서 해지해야 다음 결제가 이루어지지 않습니다.",
      cols: [
        {
          h: "iPhone에서 샀다면",
          p: "기기의 설정 앱에서 이름 > 구독으로 들어가 SyncRun을 해지합니다.",
        },
        {
          h: "Android에서 샀다면",
          p: "Google Play 앱에서 프로필 > 결제 및 정기 결제 > 정기 결제로 들어가 SyncRun을 해지합니다.",
        },
        {
          h: "해지하지 않으면",
          p: "계정을 지워도 앱 마켓의 구독은 계속 갱신될 수 있습니다. 해지해도 이미 결제한 기간이 끝날 때까지는 결제가 다시 이루어지지 않습니다.",
        },
      ],
    },
    records: {
      heading: "계정은 두고 기록만 지우기",
      lede: "계정을 지우지 않고 일부 데이터만 지울 수도 있습니다. 앱에서 지우면 서버와 다른 기기에서도 함께 지워집니다.",
      cols: [
        {
          h: "러닝 기록",
          p: "기록 상세 오른쪽 위의 더보기 메뉴(⋯ 또는 ⋮)에서 「기록 삭제」를 누릅니다. 그 기록의 경로 · 심박 · 카드 배경 사진이 함께 지워집니다.",
        },
        {
          h: "카드 배경 사진",
          p: "카드를 꾸미는 화면에서 배경을 사진이 아닌 다른 배경으로 바꿔 저장하면 서버에 보관된 사진도 지워집니다.",
        },
        {
          h: "크루",
          p: "크루 화면에서 크루를 탈퇴하면 그 크루의 소속과 출석 기록이 지워집니다. 크루장은 크루를 삭제할 수 있습니다.",
        },
      ],
    },
    email: {
      heading: "앱을 쓸 수 없을 때",
      lede: "기기를 잃어버렸거나 앱에 로그인할 수 없다면 이메일로 요청해 주세요.",
      label: "삭제 요청",
      mailSubject: "[SyncRun 계정 삭제 요청]",
      notePrefix: "본인 확인을 거친 뒤 처리하고 회신합니다. 처리 기간과 법적 근거는 ",
      noteLink: "개인정보 처리방침",
      noteSuffix: " 제7조를 따릅니다.",
      sideLabel: "적어 주실 것",
      checklist: ["로그인 수단 (Apple 또는 Google)", "가입에 쓴 이메일 주소", "계정 삭제를 요청한다는 한 줄"],
    },
    contact: {
      heading: "문의",
      prefix: "그 밖의 문의와 자주 묻는 질문은 ",
      link: "지원 페이지",
      suffix: "에 있습니다.",
    },
    foot: { home: "홈", support: "지원", legal: "약관", contact: "문의", github: "GitHub" },
  },

  en: {
    meta: {
      title: "Delete your account · SyncRun",
      description:
        "How to delete your SyncRun account from the app, what is deleted and what remains, and how to request deletion by email when you cannot use the app.",
    },
    nav: { home: "Home", support: "Support", cta: "Contact us" },
    head: {
      title: "Delete your SyncRun account",
      lede: "You can delete your SyncRun account from the app. If you cannot use the app, you can request it by email. This page also lists what is deleted and what remains.",
    },
    inApp: {
      heading: "Delete it in the app",
      lede: "Five steps. After the last confirmation the deletion happens right away, and the app returns to its first screen.",
      steps: [
        "Open the app and go to the Me tab.",
        "Open Account Management.",
        "Turn on “I understand this is permanent”.",
        "Tap Delete Account.",
        "Tap Delete Account once more in the confirmation dialog.",
      ],
    },
    deleted: {
      heading: "What is deleted",
      lede: "Deleting your account removes your account and data from the server completely.",
      cols: [
        {
          h: "Removed from the server",
          items: [
            "Your account and every run",
            "Profile name and photo",
            "Run card background photos",
            "Subscription information",
            "Crew memberships, attendance records, and crew invitations and join requests",
            "Device notification tokens",
            "Records of consent to the terms",
          ],
          p: "If you signed in with Apple, the app’s connection in your Apple ID settings is revoked as well.",
        },
        {
          h: "What remains",
          p: "Group results kept in the records of people you ran with are their records, so they are not deleted, and your name stays there as it was at the time of the run. A crew you led is not deleted; it becomes read-only without a leader, and a member can take it over. Records that the law requires us to keep are kept for that period and then deleted: records of location information use and provision for 6 months, records of consumer complaints and dispute handling for 3 years, and service access logs for 3 months.",
        },
        {
          h: "It cannot be undone",
          p: "A deleted account cannot be restored. Signing in again with the same Apple Account or Google Account creates a new, empty account.",
        },
      ],
    },
    device: {
      heading: "What stays on the device",
      lede: "Deleting your account and signing out leave different things on the device.",
      cols: [
        {
          h: "The device you deleted from",
          p: "On the device where you deleted the account, runs, photos, settings and sync data are removed together.",
        },
        {
          h: "Other devices",
          p: "If you requested deletion by email or deleted from another device, the runs and settings on the device in your hand stay there until you delete the app.",
        },
        {
          h: "Signing out",
          p: "Signing out does not delete the account. It only signs you out on this device, and the runs on the device remain.",
        },
      ],
    },
    subscription: {
      heading: "Cancel your subscription separately",
      lede: "Deleting your account does not cancel a subscription. If you subscribe to SyncRun Plus or Crew, cancel it where you bought it so that you are not charged again.",
      cols: [
        {
          h: "Bought on iPhone",
          p: "In the device’s Settings app, go to your name > Subscriptions and cancel SyncRun.",
        },
        {
          h: "Bought on Android",
          p: "In the Google Play app, go to Profile > Payments & subscriptions > Subscriptions and cancel SyncRun.",
        },
        {
          h: "If you do not cancel",
          p: "The subscription in the app store can keep renewing even after the account is deleted. After you cancel, you are not charged again, and the period you already paid for runs to its end.",
        },
      ],
    },
    records: {
      heading: "Delete data but keep your account",
      lede: "You can also delete some of your data without deleting the account. What you delete in the app is also deleted on the server and on your other devices.",
      cols: [
        {
          h: "Runs",
          p: "In a run’s details, open the more menu at the top right (⋯ or ⋮) and tap Delete run. The run’s route, heart rate and card background photo are deleted with it.",
        },
        {
          h: "Card background photos",
          p: "While editing the card, switch the background from the photo to another one and save, and the copy kept on the server is deleted too.",
        },
        {
          h: "Crews",
          p: "Leave a crew from the crew screen to delete your membership and attendance records there. A crew leader can delete the crew.",
        },
      ],
    },
    email: {
      heading: "When you cannot use the app",
      lede: "If you lost your device or cannot sign in to the app, request deletion by email.",
      label: "Deletion request",
      mailSubject: "[SyncRun account deletion request]",
      notePrefix: "We process the request after verifying your identity, then reply. The processing period and legal basis follow Article 7 of the ",
      noteLink: "Privacy Policy",
      noteSuffix: ".",
      sideLabel: "Please include",
      checklist: [
        "How you signed in (Apple or Google)",
        "The email address you signed up with",
        "One line saying you want your account deleted",
      ],
    },
    contact: {
      heading: "Contact",
      prefix: "Other questions and frequently asked questions are on the ",
      link: "support page",
      suffix: ".",
    },
    foot: { home: "Home", support: "Support", legal: "Legal", contact: "Contact", github: "GitHub" },
  },
};
