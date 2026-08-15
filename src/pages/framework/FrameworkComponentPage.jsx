import { useEffect, useRef, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import FrameworkPageLayout from '../../components/layout/FrameworkPageLayout'
import Reveal from '../../components/ui/Reveal'
import IconBlob from '../../components/ui/IconBlob'
import { FRAMEWORK_ACCENTS } from '../../content/tools-meta'
import { renderMarkdown } from '../../utils/markdown'
import frameworkComponents from '../../content/framework-components.json'

const BAND = {
  brand: 'bg-brand-50 border-brand-200',
  sun:   'bg-sun-50 border-sun-200',
  teal:  'bg-teal-50 border-teal-200',
  pink:  'bg-pink-50 border-pink-200',
}
const BIG_NUM = {
  brand: 'text-brand-200',
  sun:   'text-sun-200',
  teal:  'text-teal-200',
  pink:  'text-pink-200',
}

const sectionId = i => `bagian-${i + 1}`

export default function FrameworkComponentPage() {
  const { slug } = useParams()
  const component = frameworkComponents.find(c => c.id === slug)

  // Only the first section starts open; the TOC opens the rest on demand.
  const [open, setOpen] = useState(() => new Set([0]))
  const pending = useRef(null)

  // Reset when navigating between components, otherwise the previous page's
  // open set leaks into the next one.
  useEffect(() => {
    setOpen(new Set([0]))
  }, [slug])

  // Scroll after the section has actually been opened, so the target has its
  // final height and the browser lands on the heading rather than mid-content.
  useEffect(() => {
    if (pending.current === null) return
    const el = document.getElementById(sectionId(pending.current))
    pending.current = null
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [open])

  if (!component) return <Navigate to="/framework" replace />

  const accent = FRAMEWORK_ACCENTS[(component.order - 1) % 4]

  const toggle = i =>
    setOpen(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  const jumpTo = i => {
    pending.current = i
    setOpen(prev => new Set(prev).add(i))
  }

  return (
    <FrameworkPageLayout component={component}>
      <Reveal>
        <div className={`relative mb-8 overflow-hidden rounded-2xl border p-6 md:p-8 ${BAND[accent]}`}>
          {/* Decorative background number */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute right-4 top-0 select-none font-display text-8xl font-bold leading-none ${BIG_NUM[accent]}`}
          >
            {String(component.order).padStart(2, '0')}
          </span>
          {/* Content */}
          <div className="relative">
            <p className="eyebrow mb-2">Komponen {component.order}</p>
            <div className="mb-3 flex items-center gap-4">
              <IconBlob icon={component.icon} accent={accent} size="md" />
              <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{component.title}</h1>
            </div>
            <p className="max-w-xl text-base text-ink-muted">{component.summary}</p>
          </div>
        </div>
      </Reveal>

      {/* On-page table of contents — the sidebar says where you are in the
          framework, this says where you are inside the component. */}
      {component.sections.length > 1 && (
        <Reveal delay={60}>
          <nav aria-label="Di halaman ini" className="mb-6 rounded-2xl border border-line bg-surface-sunken p-4">
            <p className="mb-2 font-mono text-2xs uppercase tracking-widest text-ink-subtle">Di halaman ini</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {component.sections.map((section, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    className="cursor-pointer text-sm text-ink-muted underline-offset-4 transition-colors hover:text-brand-600 hover:underline"
                  >
                    {section.heading}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      )}

      <Reveal delay={100}>
        <div className="space-y-2">
          {component.sections.map((section, i) => {
            const isOpen = open.has(i)
            return (
              <section
                key={i}
                id={sectionId(i)}
                className="scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-elevated"
              >
                <h2>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`${sectionId(i)}-body`}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-elevated-hover"
                  >
                    <span className="font-display text-base font-bold text-ink">{section.heading}</span>
                    <svg
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-ink-subtle transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
                    </svg>
                  </button>
                </h2>
                {isOpen && (
                  <div
                    id={`${sectionId(i)}-body`}
                    className="prose-framework px-5 pb-5"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(section.body) }}
                  />
                )}
              </section>
            )
          })}
        </div>
      </Reveal>
    </FrameworkPageLayout>
  )
}
