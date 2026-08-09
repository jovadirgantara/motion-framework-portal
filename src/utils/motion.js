// Satu-satunya sumber nilai animasi. Halaman tidak boleh menulis variants sendiri.
export const spring     = { type: 'spring', stiffness: 260, damping: 24 }
export const springSoft = { type: 'spring', stiffness: 170, damping: 22 }
export const springSnap = { type: 'spring', stiffness: 320, damping: 20 }

export const revealUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: springSoft },
}

export const revealScale = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: springSoft },
}

// Bento-grid card entrance — scale + rise, tuned to ui-ux-pro-max's
// "Stagger List / Standard" spec (scale 0.92→1, back-out-ish snap).
export const bentoEntrance = {
  hidden:  { opacity: 0, scale: 0.92, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: springSnap },
}

export const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
}

export const buttonHover = { scale: 1.03, transition: spring }
export const buttonTap   = { scale: 0.97 }

export const viewportOnce = { once: true, margin: '-40px' }
