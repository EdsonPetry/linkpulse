import { AppSidebar } from "./components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Routes, Route } from 'react-router-dom'
import { Dashboard } from '@/components/dashboard'
import { NewPulse } from '@/components/new-pulse'
import { AllLinks } from "./components/all-links"
import { Toaster } from "sonner"
import { LlmPage } from "./components/llm-page"

function App() {
  return (
    <SidebarProvider>
      <Toaster position="bottom-right" />
      <AppSidebar />
      <main className="w-full h-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewPulse />} />
          <Route path="/all" element={<AllLinks />} />
          <Route path="/llm" element={<LlmPage/>} />
        </Routes>
      </main>
    </SidebarProvider>
  )
}

export default App