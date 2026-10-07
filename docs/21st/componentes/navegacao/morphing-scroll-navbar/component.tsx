import { useEffect, useState, type ReactNode } from "react"

export type ScrollNavLink = { label: string; href: string }

export type MorphingScrollNavbarProps = {
  brand?: ReactNode
  links?: ScrollNavLink[]
  githubUrl?: string
  socialUrl?: string
}

const DEFAULT_LINKS: ScrollNavLink[] = [
  { label: "How it works", href: "#how" },
  { label: "Control", href: "#control" },
  { label: "Assurance", href: "#assurance" },
  { label: "Developers", href: "#developers" },
  { label: "FAQ", href: "#faq" },
]

function GithubIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2.7a9.5 9.5 0 0 0-3 18.52c.48.09.66-.2.66-.46v-1.67c-2.67.58-3.23-1.14-3.23-1.14-.44-1.1-1.07-1.4-1.07-1.4-.87-.6.07-.59.07-.59.96.07 1.47.99 1.47.99.86 1.47 2.25 1.05 2.8.8.09-.62.34-1.05.61-1.29-2.13-.24-4.37-1.06-4.37-4.7 0-1.04.37-1.89.98-2.55-.1-.24-.43-1.21.09-2.52 0 0 .8-.26 2.61.97A9.1 9.1 0 0 1 12 7.34a9 9 0 0 1 2.38.32c1.81-1.23 2.6-.97 2.6-.97.53 1.31.2 2.28.1 2.52.61.66.98 1.51.98 2.55 0 3.65-2.25 4.46-4.39 4.7.35.3.65.88.65 1.77v2.63c0 .25.18.55.66.46A9.5 9.5 0 0 0 12 2.7Z" fill="currentColor"/></svg>
}

function XIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4.5h3.8l3.7 5 4.3-5H19l-5.5 6.4 5.9 8.6h-3.8l-4.2-5.9-5.1 5.9H4l6.3-7.3L5 4.5Zm3 1.2 8.2 12.6h1.2L9.2 5.7H8Z" fill="currentColor"/></svg>
}

export function MorphingScrollNavbar({
  brand = <>Return<span>Split</span></>,
  links = DEFAULT_LINKS,
  githubUrl = "https://github.com",
  socialUrl = "https://x.com",
}: MorphingScrollNavbarProps) {
  const [atTop, setAtTop] = useState(true)
  const [direction, setDirection] = useState<"up" | "down">("up")
  const [progress, setProgress] = useState(0)
  const [activeHref, setActiveHref] = useState(links[0]?.href ?? "")

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const update = () => {
      const y = window.scrollY
      const delta = y - lastY
      setAtTop(y < 8)
      if (delta > 4) setDirection("down")
      else if (delta < -4) setDirection("up")

      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0)

      const marker = y + window.innerHeight * 0.34
      let next = links[0]?.href ?? ""
      for (const link of links) {
        if (!link.href.startsWith("#")) continue
        const section = document.getElementById(link.href.slice(1))
        if (section && section.offsetTop <= marker) next = link.href
      }
      setActiveHref(next)
      lastY = y
      frame = 0
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [links])

  const floating = !atTop
  const compact = floating && direction === "down"

  return (
    <>
      <style>{STYLES}</style>
      <div className="msn-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <nav className={`msn-nav${floating ? " is-floating" : ""}${compact ? " is-compact" : ""}`} aria-label="Primary navigation">
        <div className="msn-shell">
          <a className="msn-brand" href="#top" aria-label="Go to top">{brand}</a>
          <div className="msn-links">
            {links.map((link) => (
              <a aria-current={activeHref === link.href ? "location" : undefined} href={link.href} key={link.href}>{link.label}</a>
            ))}
          </div>
          <div className="msn-actions">
            <a className="msn-button msn-github" href={githubUrl} target="_blank" rel="noreferrer" aria-label="Open GitHub in a new tab"><GithubIcon/><span>GitHub</span></a>
            <a className="msn-button msn-icon-button" href={socialUrl} target="_blank" rel="noreferrer" aria-label="Open X in a new tab"><XIcon/></a>
          </div>
        </div>
      </nav>
    </>
  )
}

const STYLES = `
.msn-progress{--accent:#176247;position:fixed;z-index:101;top:0;right:0;left:0;height:2px;background:linear-gradient(90deg,var(--accent),#4fc39a);transform:scaleX(0);transform-origin:0 50%;will-change:transform}
.msn-nav{--paper:#f6f7f5;--surface:#fff;--ink:#17201c;--muted:#59635d;--line:#cbd3cd;--accent:#176247;position:fixed;z-index:100;top:0;right:0;left:0;display:flex;justify-content:center;padding:0 20px;pointer-events:none;font-family:"Geist Variable",ui-sans-serif,system-ui,sans-serif;color:var(--ink)}
.dark .msn-nav{--paper:#101310;--surface:#171b18;--ink:#edf1ee;--muted:#9aa49e;--line:#303832;--accent:#5fc9a1}
.msn-nav *{box-sizing:border-box}.msn-nav a{color:inherit;text-decoration:none}.msn-shell{pointer-events:auto;display:flex;align-items:center;justify-content:space-between;gap:22px;width:100%;max-width:1180px;height:68px;margin-top:0;padding:0 12px 0 22px;border:1px solid transparent;border-radius:20px;background:transparent;transition:max-width .5s cubic-bezier(.34,1.32,.5,1),height .38s cubic-bezier(.34,1.2,.5,1),margin-top .38s ease,padding .38s ease,background-color .3s ease,border-color .3s ease,box-shadow .4s ease}
.msn-nav.is-floating .msn-shell{max-width:960px;height:58px;margin-top:12px;padding:0 10px 0 20px;border-color:color-mix(in srgb,var(--ink) 10%,transparent);background:color-mix(in srgb,var(--paper) 74%,transparent);-webkit-backdrop-filter:saturate(170%) blur(16px);backdrop-filter:saturate(170%) blur(16px);box-shadow:0 1px 0 color-mix(in srgb,#fff 56%,transparent) inset,0 14px 40px -20px color-mix(in srgb,var(--ink) 45%,transparent)}
.msn-nav.is-compact .msn-shell{max-width:560px;height:52px}.msn-brand{flex:none;font-size:25px;font-weight:800;line-height:1;letter-spacing:-.045em;transition:font-size .38s cubic-bezier(.34,1.2,.5,1),transform .18s ease}.msn-brand span{color:var(--accent)}.msn-brand:hover{transform:translateY(-1px)}.msn-nav.is-compact .msn-brand{font-size:22px}
.msn-links{display:flex;gap:28px;max-width:640px;overflow:hidden;opacity:1;transition:max-width .45s cubic-bezier(.34,1.2,.5,1),opacity .28s ease,transform .3s ease,gap .35s ease}.msn-nav.is-compact .msn-links{max-width:0;gap:0;opacity:0;transform:translateY(-8px);pointer-events:none}.msn-links a{position:relative;color:var(--muted);font-size:14px;font-weight:480;white-space:nowrap;transition:color .15s ease}.msn-links a:after{content:"";position:absolute;right:0;bottom:-5px;left:0;height:2px;border-radius:2px;background:var(--accent);transform:scaleX(0);transform-origin:0 50%;transition:transform .28s cubic-bezier(.2,.7,.2,1)}.msn-links a:hover,.msn-links a[aria-current="location"]{color:var(--ink)}.msn-links a:hover:after,.msn-links a[aria-current="location"]:after{transform:scaleX(1)}
.msn-actions{display:flex;flex:none;align-items:center;gap:10px}.msn-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:42px;padding:0 18px;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--ink);font-size:13.5px;font-weight:620;white-space:nowrap;transition:height .38s ease,font-size .38s ease,padding .38s ease,background-color .18s ease,transform .18s ease,box-shadow .22s ease}.msn-button svg{width:17px;height:17px}.msn-button:hover{background:color-mix(in srgb,var(--surface) 80%,var(--paper));transform:translateY(-2px);box-shadow:0 10px 22px -17px color-mix(in srgb,var(--ink) 45%,transparent)}.msn-button:active{transform:translateY(0) scale(.97)}.msn-icon-button{width:42px;padding:0}.msn-nav.is-compact .msn-button{height:36px;padding:0 14px;font-size:12.5px}.msn-nav.is-compact .msn-icon-button{width:36px;padding:0}
@media(max-width:900px){.msn-links{display:none}.msn-nav.is-floating .msn-shell{max-width:680px}.msn-nav.is-compact .msn-shell{max-width:520px}}
@media(max-width:560px){.msn-nav{padding:0 12px}.msn-shell,.msn-nav.is-floating .msn-shell,.msn-nav.is-compact .msn-shell{gap:12px;height:60px;padding:0 4px 0 10px}.msn-nav.is-floating .msn-shell,.msn-nav.is-compact .msn-shell{height:52px}.msn-brand,.msn-nav.is-compact .msn-brand{font-size:23px}.msn-actions{gap:7px}.msn-button,.msn-nav.is-compact .msn-button{height:40px;padding:0 13px;font-size:13px}.msn-nav.is-floating .msn-button,.msn-nav.is-compact .msn-button{height:36px}.msn-icon-button,.msn-nav.is-compact .msn-icon-button{width:40px;padding:0}.msn-nav.is-floating .msn-icon-button,.msn-nav.is-compact .msn-icon-button{width:36px}.msn-github span{display:none}.msn-github{width:40px;padding:0}.msn-nav.is-floating .msn-github,.msn-nav.is-compact .msn-github{width:36px;padding:0}}
@media(prefers-reduced-motion:reduce){.msn-nav *,.msn-shell,.msn-progress{transition-duration:.01ms!important}}
`
