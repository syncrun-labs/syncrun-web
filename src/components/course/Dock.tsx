import { useImperativeHandle, useRef, type Ref } from "react";
import AppleGlyph from "../scenes/AppleGlyph";
import { useLang } from "../../i18n/lang";
import { APP_STORE_URL } from "../../lib/app-store";

/**
 * 러닝 도크 — 앱의 러닝 화면 아래에 떠 있는 도크를 옮겨 왔다. 이 페이지의 유일한 내비게이션이다.
 * 왼쪽은 달린 거리·시간(스크롤이 곧 달린 거리), 가운데는 장 눈금(누르면 그 장으로), 오른쪽은 받기 버튼.
 *
 * 값은 코스의 프레임 루프가 `update`로 밀어 넣는다 — 스크롤마다 React 가 다시 렌더하지 않는다.
 */

export interface DockState {
  progress: number;
  chapter: number;
  km: number;
  seconds: number;
}

export interface DockHandle {
  update: (s: DockState) => void;
}

const clock = (s: number) => {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
};

export default function Dock({ ref, onJump }: { ref: Ref<DockHandle>; onJump: (i: number) => void }) {
  const { t } = useLang();
  const d = t.dock;
  const rootRef = useRef<HTMLDivElement>(null);
  const kmRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const last = useRef({ chapter: -1, km: "", time: "" });

  useImperativeHandle(ref, () => ({
    update({ progress, chapter, km, seconds }) {
      const root = rootRef.current;
      if (!root) return;
      root.style.setProperty("--dock-p", progress.toFixed(4));
      const k = km.toFixed(2);
      const tm = clock(seconds);
      if (k !== last.current.km && kmRef.current) kmRef.current.textContent = last.current.km = k;
      if (tm !== last.current.time && timeRef.current) timeRef.current.textContent = last.current.time = tm;
      if (chapter !== last.current.chapter) {
        last.current.chapter = chapter;
        root.querySelectorAll<HTMLButtonElement>(".dock__tick").forEach((b, i) => {
          b.classList.toggle("is-done", i <= chapter);
          if (i === chapter) b.setAttribute("aria-current", "step");
          else b.removeAttribute("aria-current");
        });
      }
    },
  }));

  return (
    <div className="dock" ref={rootRef}>
      <div className="dock__stats">
        <span className="dock__stat">
          <span className="dock__value num" ref={kmRef}>
            0.00
          </span>
          <span className="dock__label">{d.km} km</span>
        </span>
        <span className="dock__stat dock__stat--time">
          <span className="dock__value num" ref={timeRef}>
            00:00
          </span>
          <span className="dock__label">{d.time}</span>
        </span>
      </div>

      <nav className="dock__track" aria-label={d.walk}>
        <span className="dock__bar" aria-hidden="true" />
        <ol className="dock__ticks">
          {d.chapters.map((c, i) => (
            <li key={c}>
              <button type="button" className="dock__tick" onClick={() => onJump(i)}>
                <span className="dock__tick-dot" aria-hidden="true" />
                <span className="dock__tick-label">{c}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className="dock__cta" aria-label={d.cta}>
        <AppleGlyph />
        <span className="dock__cta-label">{d.cta}</span>
      </a>
    </div>
  );
}
