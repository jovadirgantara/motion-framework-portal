import { motion, useReducedMotion } from 'framer-motion'
import { springSoft, viewportOnce } from '../../utils/motion'

// Pengganti FadeIn. API delay (ms) dipertahankan agar migrasi 1:1.
export default function Reveal({ children, delay = 0, y = 24, className = '' }) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...springSoft, delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
