"use client";

import { useRef, type MouseEvent } from "react";
import type { ProductCopy } from "../../i18n/product";
import ui from "./ui.module.css";
import s from "./Faq.module.css";

const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

/**
 * 질문 하나. 열고 닫을 때 높이가 부드럽게 늘고 줄며 답이 살짝 내려앉는다.
 * 브라우저 기본 펼침을 막고 높이를 직접 움직인다. 도중에 다시 누르면 그 자리에서 방향을 바꾼다.
 * 축소 모션에서는 기본 펼침 그대로 둔다.
 */
function Item({ q, a }: { q: string; a: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const height = useRef<Animation | null>(null);
  const fade = useRef<Animation | null>(null);

  const toggle = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();

    const from = el.getBoundingClientRect().height;
    height.current?.cancel();
    fade.current?.cancel();
    const opening = !el.open || el.dataset.closing === "true";
    if (opening) {
      delete el.dataset.closing;
      el.open = true;
    } else {
      el.dataset.closing = "true";
    }
    const to = opening ? el.offsetHeight : (el.querySelector("summary")?.offsetHeight ?? 0);

    el.style.overflow = "hidden";
    const run = el.animate({ height: [`${from}px`, `${to}px`] }, { duration: 340, easing: EASE });
    // 닫힐 때는 높이가 다 줄 때까지 투명한 채로 둔다
    fade.current =
      el
        .querySelector("p")
        ?.animate(
          opening
            ? { opacity: [0, 1], transform: ["translateY(-6px)", "none"] }
            : { opacity: [1, 0], transform: ["none", "translateY(-6px)"] },
          { duration: opening ? 340 : 200, easing: EASE, fill: opening ? "none" : "forwards" },
        ) ?? null;
    height.current = run;
    run.onfinish = () => {
      height.current = null;
      el.style.overflow = "";
      if (!opening) {
        el.open = false;
        delete el.dataset.closing;
        fade.current?.cancel();
        fade.current = null;
      }
    };
  };

  return (
    <details ref={ref}>
      <summary onClick={toggle}>{q}</summary>
      <p>{a}</p>
    </details>
  );
}

/** 자주 묻는 질문. 열고 닫는 모션 때문에 클라이언트 컴포넌트다. */
export default function Faq({ copy, base }: { copy: ProductCopy["faq"]; base: string }) {
  return (
    <section className={`${s.faq} ${ui.wrap}`} aria-labelledby="faq-title">
      <h2 id="faq-title" className={s.title}>
        {copy.title}
      </h2>
      <div>
        {copy.items.map((f) => (
          <Item key={f.q} q={f.q} a={f.a} />
        ))}
        <a className={`${ui.link} ${s.more}`} href={`${base}/support`}>
          {copy.more}
        </a>
      </div>
    </section>
  );
}
