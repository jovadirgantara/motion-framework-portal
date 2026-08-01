import FrameworkPageLayout from '../../components/layout/FrameworkPageLayout'
import PageHeader from '../../components/ui/PageHeader'
import Reveal from '../../components/ui/Reveal'
import IndexRow from '../../components/ui/IndexRow'
import { FRAMEWORK_ACCENTS } from '../../content/tools-meta'
import frameworkComponents from '../../content/framework-components.json'

const overview = frameworkComponents.find(c => c.id === 'framework-overview')
const components = frameworkComponents.filter(c => c.id !== 'framework-overview').sort((a, b) => a.order - b.order)

export default function FrameworkOverview() {
  return (
    <FrameworkPageLayout component={overview}>
      <PageHeader eyebrow="/ MGLC Framework" title={overview.title} description={overview.summary}>
        <p className="text-sm text-slate-600 border-l-2 border-brand-200 pl-4 mt-4 max-w-2xl">
          Komponen 1 (Visual Hierarchy) adalah <strong className="text-slate-800">inti filosofis</strong> — baca ini
          terlebih dahulu. Komponen 2–7 adalah sistem pendukung. Komponen 8 adalah lapisan operasional.
        </p>
      </PageHeader>

      <Reveal delay={80}>
        <div>
          {components.map(comp => (
            <IndexRow
              key={comp.id}
              number={String(comp.order).padStart(2, '0')}
              title={comp.title}
              summary={comp.summary}
              to={comp.route}
              accent={FRAMEWORK_ACCENTS[(comp.order - 1) % 4]}
            />
          ))}
        </div>
      </Reveal>
    </FrameworkPageLayout>
  )
}
