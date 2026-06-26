import { useEffect, useRef, useState } from 'react'

export default function useInView({ threshold = 0.1, triggerOnce = true } = {}) {
  const ref = useRef(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [inView, setInView] = useState(prefersReducedMotion)

  useEffect(() => {
    if (prefersReducedMotion) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (triggerOnce) observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [threshold, triggerOnce, prefersReducedMotion])

  return { ref, inView }
}
