import { FiArrowUpRight, FiInstagram, FiMail, FiMapPin, FiMessageCircle, FiPhone } from 'react-icons/fi'
import siteConfig from '@/config/site'
import Reveal from '@/components/Reveal'
import PageIntro from '@/components/PageIntro'
import BookingForm from '@/components/BookingForm'

export default function ContactPage() {
  const contactLinks = [
    { title: 'WhatsApp', value: siteConfig.contact.phone, href: siteConfig.whatsapp.getUrl(), icon: FiMessageCircle, external: true },
    { title: 'Call the studio', value: siteConfig.contact.phone, href: `tel:+${siteConfig.contact.whatsapp}`, icon: FiPhone },
    ...(siteConfig.social.instagram ? [{ title: 'Instagram', value: `@${siteConfig.contact.instagram}`, href: siteConfig.social.instagram, icon: FiInstagram, external: true }] : []),
    ...(siteConfig.contact.email ? [{ title: 'Email', value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}`, icon: FiMail }] : []),
  ]
  const hours = [siteConfig.hours.weekdays, siteConfig.hours.weekend].filter(item => item.days && item.time)

  return (
    <div className="min-h-screen">
      <PageIntro
        eyebrow="Appointments"
        title="Book your visit"
        description="Book tattoo, piercing, or beauty services."
      />

      <section className="section-space border-t border-paper/10" aria-labelledby="contact-the-studio">
        <div className="studio-container grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <h2 id="contact-the-studio" className="section-title mb-8">Contact the studio</h2>
            <div className="border-t border-paper/15">
              {contactLinks.map(({ title, value, href, icon: Icon, external }) => (
                <a
                  key={title}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4 border-b border-paper/15 py-5 transition-colors hover:text-gold"
                >
                  <Icon aria-hidden="true" className="shrink-0 text-xl text-gold" />
                  <div className="min-w-0 flex-1">
                    <p className="text-muted mb-1 text-[10px] uppercase tracking-[0.2em]">{title}</p>
                    <p className="break-words text-sm">{value}</p>
                  </div>
                  <FiArrowUpRight aria-hidden="true" className="shrink-0 text-lg text-gold transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <BookingForm />
          </Reveal>
        </div>
      </section>

      <section className="section-space border-t border-paper/10" aria-labelledby="visit-the-studio">
        <div className="studio-container">
          <Reveal className="mb-10 grid gap-8 md:grid-cols-2 md:items-end">
            <div>
              <h2 id="visit-the-studio" className="section-title">Visit the studio</h2>
            </div>
            <a href={siteConfig.maps.directionsUrl} target="_blank" rel="noopener noreferrer" className="button-outline inline-flex w-fit items-center gap-4 md:ml-auto">Get directions <FiArrowUpRight aria-hidden="true" /></a>
          </Reveal>
          <Reveal>
            <div className="overflow-hidden border border-paper/15">
              <iframe src={siteConfig.maps.embedUrl} width="100%" height="420" className="h-[300px] w-full grayscale transition-all duration-700 hover:grayscale-0 sm:h-[420px]" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`${siteConfig.businessName} location in ${siteConfig.address.city}`} />
            </div>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <Reveal>
              <div className="mb-4 flex items-center gap-3"><FiMapPin aria-hidden="true" className="text-gold" /><h3 className="eyebrow">The address</h3></div>
              <address className="text-muted max-w-sm text-sm not-italic leading-relaxed">{siteConfig.businessName}<br />{siteConfig.address.full}</address>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="eyebrow mb-4">Studio hours</h3>
              <dl className="space-y-3 text-sm">
                {hours.map(item => (
                  <div key={item.days} className="flex flex-wrap justify-between gap-3"><dt className="text-muted">{item.days}</dt><dd className="text-paper">{item.time}</dd></div>
                ))}
              </dl>
              <p className="text-muted mt-4 text-xs leading-relaxed">{siteConfig.hours.note}</p>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
