import { Logo } from "./Logo";

/** 잠금 화면 알림 배너 모양으로 실제 모습을 미리 본다. */
export function NotificationPreview({ title, body }: { title: string; body: string }) {
  return (
    <div className="phone">
      <div className="phone-time num">9:41</div>
      <div className="banner glass glass-card">
        <Logo size={38} />
        <div className="banner-text">
          <div className="banner-head">
            <strong>SyncRun</strong>
            <span>지금</span>
          </div>
          <div className="banner-title">{title || "제목"}</div>
          <div className="banner-body">{body || "본문이 여기에 보여요"}</div>
        </div>
      </div>
    </div>
  );
}
