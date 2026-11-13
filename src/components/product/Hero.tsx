"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import homeIdle from "@/public/product/home-idle.jpg";
import homePairLeft from "@/public/product/home-pair-left.jpg";
import homePairRight from "@/public/product/home-pair-right.jpg";
import storeQr from "@/public/product/store-qr.svg";
import type { ProductCopy } from "../../i18n/product";
import { shouldSkipReveal } from "../../lib/reveal";
import { useIsAndroid } from "../../lib/useIsAndroid";
import { Phone, StoreButton } from "./ui";
import ui from "./ui.module.css";
import s from "./Hero.module.css";

/**
 * 첫 화면. 두 폰이 다가와 맞닿고, 닿는 순간 화면이 그룹으로 바뀌며 원이 퍼진다.
 * 브라우저에서만 알 수 있는 두 가지(축소 모션·`?reveal=all`, Android 기기) 때문에 클라이언트 컴포넌트다.
 */
export default function Hero({ copy, store }: { copy: ProductCopy["hero"]; store: string }) {
  const artRef = useRef<HTMLDivElement>(null);
  const isAndroid = useIsAndroid();

  // 축소 모션과 `?reveal=all`(시각 회귀)에서는 닿은 순간의 한 장으로 멈춘다
  useEffect(() => {
    if (shouldSkipReveal()) artRef.current?.classList.add(s.still);
  }, []);

  return (
    <section className={`${s.hero} ${ui.wrap}`}>
      <div>
        <h1>
          {copy.title[0]}
          <br />
          {copy.title[1]}
          <br />
          <em>{copy.title[2]}</em>
        </h1>
        <p className={ui.lede}>{copy.lede}</p>
        <div className={s.cta}>
          <StoreButton label={store} />
          <span className={ui.note}>{copy.note}</span>
        </div>
        {isAndroid && <p className={s.android}>{copy.android}</p>}
        <div className={s.qr}>
          {/* 모바일에서는 숨기지만, 지연 로딩이면 끝내 불러오지 않아 바로 불러 둔다(2KB 미만) */}
          <Image src={storeQr} alt="" width={84} height={84} loading="eager" />
          <span>{copy.qr}</span>
        </div>
      </div>
      <div className={s.art} ref={artRef}>
        {[homePairLeft, homePairRight].map((after) => (
          <Phone
            key={after.src}
            src={homeIdle}
            alt={copy.altIdle}
            after={after}
            afterAlt={copy.altPair}
            priority
            className={s.phone}
            afterClassName={s.after}
          />
        ))}
        <span className={s.bump} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
    </section>
  );
}
