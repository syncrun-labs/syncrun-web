"use client";

import Image from "next/image";
import homeIdle from "@/public/product/home-idle.jpg";
import storeQr from "@/public/product/store-qr.svg";
import type { ProductCopy } from "../../i18n/product";
import { useIsAndroid } from "../../lib/useIsAndroid";
import { Phone, StoreButton } from "./ui";
import ui from "./ui.module.css";
import s from "./Hero.module.css";

/**
 * 첫 화면. 무엇인지 한 문장과 내려받기, 옆에 앱 홈 화면 두 대.
 * Android 기기인지는 브라우저에서만 알 수 있어 클라이언트 컴포넌트다.
 */
export default function Hero({ copy, store }: { copy: ProductCopy["hero"]; store: string }) {
  const isAndroid = useIsAndroid();

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
      <div className={s.art}>
        <Phone src={homeIdle} alt={copy.altIdle} priority className={s.phone} />
        <Phone src={homeIdle} alt={copy.altIdle} priority className={s.phone} />
      </div>
    </section>
  );
}
