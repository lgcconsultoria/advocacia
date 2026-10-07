import { MorphingScrollNavbar } from "@/components/ui/morphing-scroll-navbar"

const sections = [
  ["how", "01", "How it works", "A navigation bar that responds to reading intent."],
  ["control", "02", "Control", "Scroll upward and the links return before you reach the top."],
  ["assurance", "03", "Assurance", "Every transition is restrained and reversible."],
  ["developers", "04", "Developers", "One component, no animation dependency."],
  ["faq", "05", "FAQ", "Responsive by construction."],
]

export default function MorphingScrollNavbarDemo() {
  return (
    <main className="msn-demo">
      <style>{DEMO_STYLES}</style>
      <MorphingScrollNavbar />
      <header className="msn-demo-hero" id="top">
        <div className="msn-demo-dots" />
        <p>Scroll-responsive navigation</p>
        <h1>Calm at rest.<br />Useful in motion.</h1>
        <span>Scroll to see the shell float, compress and restore itself.</span>
      </header>
      {sections.map(([id, index, eyebrow, title]) => (
        <section className="msn-demo-section" id={id} key={id}>
          <div className="msn-demo-index">{index}</div>
          <div><p>{eyebrow}</p><h2>{title}</h2></div>
        </section>
      ))}
    </main>
  )
}

const DEMO_STYLES = `
*{box-sizing:border-box}html{scroll-behavior:smooth}.msn-demo{min-height:100vh;background:#f6f7f5;color:#17201c;font-family:"Geist Variable",ui-sans-serif,system-ui,sans-serif}.msn-demo-hero{position:relative;min-height:100vh;display:grid;place-content:center;justify-items:center;padding:120px 24px 80px;text-align:center;overflow:hidden}.msn-demo-dots{position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(23,32,28,.11) 1px,transparent 0);background-size:27px 27px;mask-image:radial-gradient(ellipse 70% 65% at 50% 38%,#000 20%,transparent 72%)}.msn-demo-hero>*:not(.msn-demo-dots){position:relative}.msn-demo-hero p,.msn-demo-section p{margin:0 0 18px;color:#176247;font-size:11px;font-weight:650;letter-spacing:.1em;text-transform:uppercase}.msn-demo-hero h1{margin:0;font-size:clamp(52px,8.2vw,112px);font-weight:590;line-height:.91;letter-spacing:-.065em;text-wrap:balance}.msn-demo-hero>span{margin-top:30px;color:#68716b;font-size:15px}.msn-demo-section{width:min(1120px,calc(100% - 48px));min-height:92vh;margin:auto;padding:120px 0;display:grid;grid-template-columns:minmax(120px,.34fr) minmax(0,1fr);gap:48px;scroll-margin-top:90px;border-top:1px solid #dce1dd}.msn-demo-index{color:#8b938e;font-size:11px}.msn-demo-index:before{content:"";display:block;width:48px;height:1px;margin-bottom:14px;background:#176247}.msn-demo-section h2{max-width:760px;margin:0;font-size:clamp(38px,5.4vw,72px);font-weight:560;letter-spacing:-.05em;line-height:.98;text-wrap:balance}.dark .msn-demo{background:#101310;color:#edf1ee}.dark .msn-demo-dots{background-image:radial-gradient(circle at 1px 1px,rgba(237,241,238,.1) 1px,transparent 0)}.dark .msn-demo-hero>span{color:#9aa49e}.dark .msn-demo-section{border-color:#2b312d}@media(max-width:700px){.msn-demo-section{width:calc(100% - 36px);grid-template-columns:1fr;gap:32px;padding:84px 0}.msn-demo-hero h1{font-size:clamp(48px,15vw,76px)}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`
