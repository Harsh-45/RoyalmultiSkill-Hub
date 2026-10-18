'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function Reveal({ children, className = '', delay = 0 }) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reducedMotion ? 0 : 0.8,
        delay: reducedMotion ? 0 : delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
