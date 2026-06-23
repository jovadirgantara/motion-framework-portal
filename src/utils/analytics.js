// Analytics event tracker — GA4 + Posthog
// Events yang tracked: naming_generated, classifier_completed,
// checklist_completed, checklist_exported, render_lookup, feedback_opened

export function trackEvent(eventName, properties = {}) {
  // GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
  // Posthog
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture(eventName, properties)
  }
}
