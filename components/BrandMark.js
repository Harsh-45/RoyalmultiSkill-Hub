export default function BrandMark({ className = 'h-12 w-12' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true" focusable="false">
      <path d="M32 3 60.5 19.5v25L32 61 3.5 44.5v-25L32 3Z" stroke="currentColor" strokeWidth="0.8" />
      <path d="M32 8 56 22v20L32 56 8 42V22L32 8Z" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <path d="M22 44V20h12c6 0 10 3 10 8s-4 8-10 8H22m11 0 12 12M22 25v-9m0 33v-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
      <path d="M32 3v5m0 48v5M3.5 19.5 8 22m48 20 4.5 2.5" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}
