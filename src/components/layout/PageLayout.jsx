import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function PageLayout({ children, sidebar = null, className = '' }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {sidebar ? (
          <div className="flex gap-8">
            <Sidebar section={sidebar} />
            <main className={`flex-1 min-w-0 ${className}`}>
              {children}
            </main>
          </div>
        ) : (
          <main className={`${className}`}>
            {children}
          </main>
        )}
      </div>
      <Footer />
    </div>
  )
}
