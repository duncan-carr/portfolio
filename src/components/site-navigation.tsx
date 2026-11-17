"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export function SiteNavigation({
  home,
  showProjects,
}: {
  home: boolean;
  showProjects: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const desktopRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLButtonElement>(null);
  const mobileRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const menuId = useId();
  const prefix = home ? "" : "/";

  function closeMobileMenu() {
    if (mobileRef.current) mobileRef.current.open = false;
  }

  useEffect(() => {
    const desktop = desktopRef.current;
    if (!desktop) return;
    const hoverDesktop = window.matchMedia(
      "(min-width: 761px) and (hover: hover) and (pointer: fine)",
    );
    let nearby = false;
    let collapseTimer: ReturnType<typeof setTimeout> | undefined;

    function cancelCollapse() {
      clearTimeout(collapseTimer);
      collapseTimer = undefined;
    }

    function scheduleCollapse() {
      if (!hoverDesktop.matches || nearby || collapseTimer !== undefined) return;
      collapseTimer = setTimeout(() => {
        collapseTimer = undefined;
        if (!nearby && !desktop?.querySelector(":focus-visible")) {
          setExpanded(false);
        }
      }, 2000);
    }

    function handlePointerMove(event: PointerEvent) {
      if (!hoverDesktop.matches || event.pointerType === "touch") return;
      const bounds = desktop!.getBoundingClientRect();
      nearby = event.clientX >= bounds.left - 36 &&
        event.clientX <= bounds.right + 36 &&
        event.clientY >= bounds.top - 32 &&
        event.clientY <= bounds.bottom + 32;
      if (nearby) {
        cancelCollapse();
        setExpanded(true);
      } else {
        scheduleCollapse();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (!mobileRef.current?.contains(event.target as Node)) {
        closeMobileMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && mobileRef.current?.open) {
        closeMobileMenu();
        summaryRef.current?.focus();
      }
    }

    function handleFocusIn(event: FocusEvent) {
      if (desktop?.contains(event.target as Node)) {
        cancelCollapse();
        if (event.target !== blobRef.current) setExpanded(true);
      }
    }

    function handleFocusOut(event: FocusEvent) {
      if (!desktop?.contains(event.relatedTarget as Node)) scheduleCollapse();
    }

    function handleResize() {
      cancelCollapse();
      nearby = false;
      setExpanded(true);
      closeMobileMenu();
      scheduleCollapse();
    }

    scheduleCollapse();
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    hoverDesktop.addEventListener("change", handleResize);
    return () => {
      cancelCollapse();
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      hoverDesktop.removeEventListener("change", handleResize);
    };
  }, []);

  const links = [
    { id: "experience", label: "Experience" },
    { id: "credentials", label: "Credentials" },
    { id: "education", label: "Education" },
    ...(showProjects ? [{ id: "projects", label: "Projects" }] : []),
  ].map(({ id, label }) => (
    <Link key={id} href={`${prefix}#${id}`} onClick={closeMobileMenu}>
      {label}
    </Link>
  ));

  return (
    <div className="site-navigation" data-projects={showProjects}>
      <div
        className="desktop-navigation"
        ref={desktopRef}
        data-expanded={expanded}
      >
        <button
          className="navigation-blob"
          ref={blobRef}
          type="button"
          aria-label="Expand navigation"
          aria-expanded={expanded}
          aria-controls={`${menuId}-desktop`}
          tabIndex={expanded ? -1 : 0}
          onClick={() => {
            setExpanded(true);
            requestAnimationFrame(() => desktopRef.current?.querySelector("a")?.focus());
          }}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <nav
          className="navigation-links"
          id={`${menuId}-desktop`}
          aria-label="Main navigation"
          aria-hidden={!expanded}
          inert={!expanded}
        >
          {links}
        </nav>
      </div>
      <details className="mobile-navigation" ref={mobileRef}>
        <summary
          className="navigation-toggle"
          ref={summaryRef}
          aria-label="Toggle navigation"
          aria-controls={`${menuId}-mobile`}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </summary>
        <nav
          className="navigation-links"
          id={`${menuId}-mobile`}
          aria-label="Main navigation"
        >
          {links}
        </nav>
      </details>
    </div>
  );
}
