import { NavLink } from 'react-router-dom'

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

export default function Sidebar({ section }) {
  return (
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
  )
}
