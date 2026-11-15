import Image from "next/image";
import type { ReactNode } from "react";
import wordmark from "@/public/brand/wordmark.png";
import LangToggle from "./LangToggle";
import type { Lang } from "../i18n/dict";
import type { LangPaths } from "../i18n/lang";
import d from "./doc.module.css";

/**
 * 문서형 페이지(지원·회사 소개·계정 삭제·약관·크루 초대)가 같이 쓰는 틀.
 * 모양은 `doc.module.css` 하나가 정하고, 페이지는 링크와 문구만 넘긴다. 모두 서버 컴포넌트다.
 * `.doc-nav`·`.doc-foot`은 약관 URL 계약 테스트가 찾는 이름이라 모듈 클래스와 함께 둔다.
 */

export interface DocLink {
  href: string;
  label: string;
  /** 새 창으로 여는 바깥 링크(GitHub 등) */
  external?: boolean;
}

const externalProps = (l: DocLink) => (l.external ? { target: "_blank", rel: "noreferrer" } : {});

/** 머리 막대: 로고, 링크, 언어 전환(있으면), 문의 버튼(있으면) */
export function DocHeader({
  home,
  links,
  lang,
  paths,
  cta,
}: {
  home: string;
  links: DocLink[];
  lang?: Lang;
  paths?: LangPaths;
  cta?: DocLink;
}) {
  return (
    <header className={`doc-nav ${d.nav}`}>
      <div className={`container ${d["nav-inner"]}`}>
        <a href={home} className={d["nav-brand"]}>
          <Image src={wordmark} alt="SyncRun" className={d["nav-wordmark"]} priority />
        </a>
        <div className={d["nav-actions"]}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className={d["nav-link"]} {...externalProps(l)}>
              {l.label}
            </a>
          ))}
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
            <a key={l.label} href={l.href} {...externalProps(l)}>
              {l.label}
            </a>
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
