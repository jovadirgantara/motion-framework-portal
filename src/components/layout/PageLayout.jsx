import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function PageLayout({ children, sidebar = null, className = '', maxWidthClassName = 'max-w-7xl' }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <a href="#konten" className="skip-link">Lompat ke konten</a>
      <Header />
      <div className={`flex-1 ${maxWidthClassName} mx-auto w-full px-4 py-8 sm:px-6 lg:px-8`}>
        {sidebar ? (
          <div className="flex flex-col gap-10 lg:flex-row">
            <Sidebar section={sidebar} />
            <main id="konten" className={`min-w-0 flex-1 ${className}`}>
              {children}
            </main>
          </div>
        ) : (
          <main id="konten" className={className}>
            {children}
          </main>
        )}
      </div>
      <Footer />
    </div>
  )
}
