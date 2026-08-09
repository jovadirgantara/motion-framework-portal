import { NavLink, useNavigate, useLocation } from 'react-router-dom'

const frameworkLinks = [
  { to: '/framework', label: 'Overview', exact: true },
  { to: '/framework/visual-hierarchy', label: '1. Visual Hierarchy' },
  { to: '/framework/complexity', label: '2. Klasifikasi Kompleksitas' },
  { to: '/framework/workflow', label: '3. Workflow Produksi' },
  { to: '/framework/asset-management', label: '4. Manajemen Aset & Folder' },
  { to: '/framework/naming-convention', label: '5. Naming Convention' },
  { to: '/framework/render-standard', label: '6. Render Standard' },
  { to: '/framework/quality-control', label: '7. Quality Control' },
]

const toolLinks = [
  { to: '/tools', label: 'Semua Tools', exact: true },
  { to: '/tools/naming-generator', label: '1. Naming Generator' },
  { to: '/tools/complexity-classifier', label: '2. Complexity Classifier' },
  { to: '/tools/visual-hierarchy-checklist', label: '3. VH Checklist' },
  { to: '/tools/render-calculator', label: '4. Render Calculator' },
]

function SidebarGroup({ title, links }) {
  return (
    <div>
      <p className="px-3 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
      <ul className="space-y-0.5">
        {links.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `block px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Below lg, the list sidebar is hidden entirely — without this select, mobile
// users on a Framework/Tools sub-page would have no way to jump to another
// component except navigating back to the Overview page first.
function MobileJumpSelect({ section }) {
  const navigate = useNavigate()
  const location = useLocation()
  const groups = [
    (section === 'framework' || !section) && { title: 'Framework', links: frameworkLinks },
    (section === 'tools' || !section) && { title: 'Tools', links: toolLinks },
  ].filter(Boolean)

  return (
    <select
      value={location.pathname}
      onChange={e => navigate(e.target.value)}
      className="lg:hidden w-full mb-6 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
    >
      {groups.map(g => (
        <optgroup key={g.title} label={g.title}>
          {g.links.map(link => (
            <option key={link.to} value={link.to}>{link.label}</option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}

export default function Sidebar({ section }) {
  return (
    <>
      <MobileJumpSelect section={section} />
      <aside className="w-56 shrink-0 hidden lg:block">
        <div className="sticky top-20 space-y-6 py-2">
          {(section === 'framework' || !section) && (
            <SidebarGroup title="Framework" links={frameworkLinks} />
          )}
          {(section === 'tools' || !section) && (
            <SidebarGroup title="Tools" links={toolLinks} />
          )}
        </div>
      </aside>
    </>
  )
}
