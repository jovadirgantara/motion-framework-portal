import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home                    from './pages/Home'
import FrameworkOverview       from './pages/framework/FrameworkOverview'
import FrameworkComponentPage  from './pages/framework/FrameworkComponentPage'
import ToolsHub                from './pages/tools/ToolsHub'
import NamingGenerator         from './pages/tools/NamingGenerator'
import ComplexityClassifier    from './pages/tools/ComplexityClassifier'
import VHChecklist             from './pages/tools/VHChecklist'
import RenderCalculator        from './pages/tools/RenderCalculator'
import Downloads               from './pages/Downloads'
import GetStarted              from './pages/GetStarted'
import Feedback                from './pages/Feedback'
import About                   from './pages/About'
import CampaignSchedule        from './pages/CampaignSchedule'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/"                  element={<Home />} />

        {/* Framework */}
        <Route path="/framework"                          element={<FrameworkOverview />} />
        <Route path="/framework/:slug"                    element={<FrameworkComponentPage />} />

        {/* Tools */}
        <Route path="/tools"                              element={<ToolsHub />} />
        <Route path="/tools/naming-generator"             element={<NamingGenerator />} />
        <Route path="/tools/complexity-classifier"        element={<ComplexityClassifier />} />
        <Route path="/tools/visual-hierarchy-checklist"   element={<VHChecklist />} />
        <Route path="/tools/render-calculator"            element={<RenderCalculator />} />

        {/* Campaign Schedule (Display Layer) */}
        <Route path="/campaign"    element={<CampaignSchedule />} />

        {/* Other pages */}
        <Route path="/downloads"   element={<Downloads />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/feedback"    element={<Feedback />} />
        <Route path="/about"       element={<About />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
