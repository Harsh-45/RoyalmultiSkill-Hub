import Reveal from '@/components/Reveal'

export default function PageIntro({ eyebrow, title, description }) {
  return (
    <header className="page-intro relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-[450px] w-[450px] rounded-full border border-gold/10"
      />
      <div className="studio-container relative">
        <Reveal>
          <span className="eyebrow mb-7">{eyebrow}</span>
          <h1 className="display-title max-w-5xl">{title}</h1>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-sm leading-7 text-muted md:text-base">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  )
}
