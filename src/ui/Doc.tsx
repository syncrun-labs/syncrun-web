import Image from "next/image";
import type { ReactNode } from "react";
import wordmark from "@/public/brand/wordmark.png";
import type { Route } from "next";
import LangToggle from "./LangToggle";
import SiteLink from "./SiteLink";
import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import d from "./doc.module.css";

/**
 * 문서형 페이지(지원·회사 소개·계정 삭제·약관·크루 초대)가 같이 쓰는 틀.
 * 모양은 `doc.module.css` 하나가 정하고, 페이지는 링크와 문구만 넘긴다. 모두 서버 컴포넌트다.
 * `.doc-nav`·`.doc-foot`은 약관 URL 계약 테스트가 찾는 이름이라 모듈 클래스와 함께 둔다.
 */

/** 사이트 안 경로, mailto, 바깥 주소. 어떻게 그릴지는 `SiteLink`가 주소를 보고 정한다. */
export interface DocLink {
  href: Route;
  label: string;
  /** 다른 언어로 가는 링크. 루트 레이아웃이 달라 어차피 문서 전체를 새로 받으므로 `<a>`로 그리고 미리 받지 않는다 */
  otherLang?: boolean;
}

/** 머리 막대: 로고, 링크, 언어 전환(있으면), 문의 버튼(있으면) */
export function DocHeader({
  home,
  links,
  lang,
  paths,
  cta,
}: {
  home: Route;
  links: DocLink[];
  lang?: Lang;
  paths?: LangPaths;
  cta?: DocLink;
}) {
  return (
    <header className={`doc-nav ${d.nav}`}>
      <div className={`container ${d["nav-inner"]}`}>
        <SiteLink href={home} className={d["nav-brand"]}>
          <Image src={wordmark} alt="SyncRun" className={d["nav-wordmark"]} priority />
        </SiteLink>
        <div className={d["nav-actions"]}>
          {links.map((l) =>
            l.otherLang ? (
              <a key={l.href} href={l.href} className={d["nav-link"]}>
                {l.label}
              </a>
            ) : (
              <SiteLink key={l.href} href={l.href} className={d["nav-link"]}>
                {l.label}
              </SiteLink>
            ),
          )}
          {lang && paths && <LangToggle lang={lang} paths={paths} />}
          {cta && (
            <a href={cta.href} className={`btn btn-primary ${d["nav-cta"]}`}>
              {cta.label}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

export function DocFooter({ owner, links }: { owner: string; links: DocLink[] }) {
  return (
    <footer className={`doc-foot ${d.foot}`}>
      <div className={`container ${d["foot-inner"]}`}>
        <span className="mono">© 2026 {owner}</span>
        <div className={d["foot-links"]}>
          {links.map((l) => (
            <SiteLink key={l.label} href={l.href}>
              {l.label}
            </SiteLink>
          ))}
        </div>
      </div>
    </footer>
  );
}

/** 본문 섹션: 제목과 소개 한 줄 뒤에 내용 */
export function DocSection({
  id,
  heading,
  lede,
  children,
}: {
  id: string;
  heading: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className={d.section} id={id}>
      <h2 className={`h2 ${d.heading}`}>{heading}</h2>
      {lede && <p className={d["section-lede"]}>{lede}</p>}
      {children}
    </section>
  );
}

/** 이메일 문의 상자: 왼쪽에 라벨·이메일·안내, 오른쪽에 라벨과 목록 */
export function ContactBox({
  as: Tag = "section",
  id,
  label,
  email,
  href,
  note,
  sideLabel,
  children,
}: {
  as?: "section" | "div";
  id?: string;
  label: ReactNode;
  email: string;
  href: string;
  note: ReactNode;
  sideLabel: ReactNode;
  /** 오른쪽 목록의 `<li>`들 */
  children: ReactNode;
}) {
  return (
    <Tag className={`glass ${d.contact}`} id={id}>
      <div>
        <span className={`mono ${d.label}`}>{label}</span>
        <a href={href} className={d.email}>
          {email}
        </a>
        <p className={d["contact-note"]}>{note}</p>
      </div>
      <div className={d["contact-side"]}>
        <span className={`mono ${d.label}`}>{sideLabel}</span>
        <ul className={d.list}>{children}</ul>
      </div>
    </Tag>
  );
}
