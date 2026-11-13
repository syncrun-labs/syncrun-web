import Image, { type StaticImageData } from "next/image";
import AppleGlyph from "../scenes/AppleGlyph";
import { APP_STORE_URL } from "../../lib/app-store";
import { barStyle } from "./runners";
import s from "./ui.module.css";

/** 랜딩의 여러 섹션이 같이 쓰는 조각. 섹션 하나만 쓰는 것은 그 섹션 파일에 둔다. */

export function StoreButton({ label, className }: { label: string; className?: string }) {
  return (
    <a
      className={className ? `${s.store} ${className}` : s.store}
      href={APP_STORE_URL}
      target="_blank"
      rel="noreferrer"
    >
      <AppleGlyph />
      {label}
    </a>
  );
}

/**
 * iPhone 18 Pro 화면을 그대로 담은 기기. `after`가 있으면 그 화면을 위에 겹쳐 둔다.
 * 겹친 화면을 언제 보일지는 쓰는 쪽이 `afterClassName`으로 정한다(첫 화면의 맞닿는 모션).
 */
export function Phone({
  src,
  alt,
  after,
  afterAlt,
  priority,
  crop,
  className,
  afterClassName,
}: {
  src: StaticImageData;
  alt: string;
  after?: StaticImageData;
  afterAlt?: string;
  priority?: boolean;
  /** 상태 표시줄 없이 잘린 화면. 위에 상태 표시줄 자리를 비우고 화면 비율로 맞춘다 */
  crop?: boolean;
  className?: string;
  afterClassName?: string;
}) {
  const sizes = "(max-width: 860px) 44vw, 250px";
  const image = <Image src={src} alt={alt} priority={priority} sizes={sizes} />;
  return (
    <div className={className ? `${s.phone} ${className}` : s.phone}>
      <div className={s.screen}>
        {crop ? <span className={s.crop}>{image}</span> : image}
        {after && (
          <span className={afterClassName ? `${s.after} ${afterClassName}` : s.after}>
            <Image src={after} alt={afterAlt ?? ""} priority={priority} sizes={sizes} />
          </span>
        )}
        <span className={s.island} aria-hidden="true" />
      </div>
    </div>
  );
}

/** 기능 설명 옆의 앱 화면. 첫 화면과 같은 폰 프레임에 담는다. */
export function Screen({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <div className={s.shot}>
      <Phone src={src} alt={alt} crop />
    </div>
  );
}

export function FeatureList({ items }: { items: { k: string; v: string }[] }) {
  return (
    <ul className={s.facts}>
      {items.map((f, i) => (
        <li key={f.k} style={barStyle(i)}>
          <h3>{f.k}</h3>
          <p>{f.v}</p>
        </li>
      ))}
    </ul>
  );
}
