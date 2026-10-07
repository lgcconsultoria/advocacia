import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsappFloat } from '@/components/whatsapp-float';
import SmoothScroll from '@/components/smooth-scroll';
import { ProvedorDiagnostico } from '@/components/diagnostico/contexto';
import { getAreas, getSettings } from '@/lib/reader';

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [areas, settings] = await Promise.all([getAreas(), getSettings()]);
  const areaLinks = areas.map((a) => ({ slug: a.slug, title: a.title, group: a.group }));

  return (
    <ProvedorDiagnostico whatsapp={settings.whatsapp}>
      <SmoothScroll />
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo">{children}</main>
      <SiteFooter areas={areaLinks} settings={settings} />
      <WhatsappFloat whatsapp={settings.whatsapp} />
    </ProvedorDiagnostico>
  );
}
