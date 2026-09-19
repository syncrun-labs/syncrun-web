import HeroScrub from "../ui/HeroScrub";
import { useLang } from "../../i18n/lang";
import { APP_STORE_URL } from "../../lib/app-store";

/**
 * Hero — 스크롤이 배경 프레임을 넘기고 카피가 제자리에서 떴다 지는 다크 섹션.
 *
 * 세 마디는 무대(`.hero__stage`) 안에 있다. 기본 상태에서는 그냥 위에서 아래로 쌓인
 * 한 화면짜리 섹션이고, `HeroScrub` 이 마운트되며 `hero--scrub` 을 붙일 때만 무대가 길어지고
 * 마디가 같은 자리에서 겹쳐 교차한다 — 그래서 축소 모션·`?reveal=all`·JS 실패에서도
 * 카피가 온전히 읽힌다.
 *
 * 제목의 줄바꿈은 카피가 배열로 들고 있다. 한글 디스플레이를 자동 줄바꿈에 맡기면
 * 화면폭마다 다른 자리에서 깨진다.
 */
export default function Hero() {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section className="hero section--dark" id="top">
      <div className="hero__stage">
        <HeroScrub alt={h.backdropAlt} />

        <div className="hero__beats">
          {h.beats.map((b, i) => {
            const Title = i === 0 ? "h1" : "h2";
            return (
              <div className="hero__beat" key={b.h.join()}>
                <div className="container hero__copy">
                  <Title className="display hero__title">
                    {b.h.map((line, j) => (
                      <span className={`hero__line${b.accent === j ? " hero__line--accent" : ""}`} key={line}>
                        {line}
                      </span>
                    ))}
                  </Title>
                  <p className="lede hero__lede">{b.p}</p>

                  {i === h.beats.length - 1 && (
                    <div className="hero__actions">
                      <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className="btn btn-primary">
                        <AppleGlyph />
                        {h.ctaPrimary}
                      </a>
                      <a href="#onestart" className="btn btn-ghost">
                        {h.ctaSecondary}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AppleGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.04c-.03-2.8 2.29-4.14 2.39-4.2-1.3-1.9-3.33-2.16-4.05-2.19-1.72-.17-3.36 1.01-4.23 1.01-.87 0-2.22-.99-3.65-.96-1.88.03-3.61 1.09-4.58 2.77-1.95 3.39-.5 8.4 1.4 11.15.93 1.35 2.03 2.86 3.48 2.8 1.4-.06 1.92-.9 3.61-.9 1.68 0 2.16.9 3.64.87 1.5-.02 2.45-1.37 3.37-2.72 1.06-1.56 1.5-3.07 1.52-3.15-.03-.01-2.92-1.12-2.95-4.44zM14.28 3.79c.77-.93 1.29-2.22 1.15-3.51-1.11.04-2.46.74-3.25 1.67-.71.82-1.33 2.14-1.16 3.4 1.24.1 2.5-.63 3.26-1.56z" />
    </svg>
  );
}
