import AnimatedContent from "../reactbits/AnimatedContent";
import { useLang } from "../../i18n/lang";
import { APP_STORE_URL } from "../../lib/app-store";

/**
 * CTA — 다크 전폭 밴드. 히어로와 짝을 이뤄 페이지를 다크로 닫는다.
 * 떠 있는 둥근 패널이 아니라 화면을 가로지르는 띠다 — 마지막에 한 번 더 어두워지는 리듬이 있어야 한다.
 */
export default function CTA() {
  const { t, base } = useLang();
  const c = t.cta;

  return (
    <section className="section section--dark cta" id="cta">
      <div className="container cta__inner">
        <AnimatedContent direction="up" distance={24}>
          <h2 className="h2 cta__title">
            {c.title.map((line, i) => (
              <span className={`cta__line${i === c.title.length - 1 ? " cta__line--accent" : ""}`} key={line}>
                {line}
              </span>
            ))}
          </h2>
          <p className="lede cta__lede">{c.lede}</p>
          <div className="cta__actions">
            <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
              {c.ctaPrimary}
            </a>
            <a href={`${base}/support`} className="btn btn-ghost cta__help">
              {c.ctaSecondary}
            </a>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
