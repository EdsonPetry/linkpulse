import { AppSidebar } from "./components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Routes, Route } from 'react-router-dom'
import { Dashboard } from '@/components/dashboard'
import { NewPulse } from '@/components/new-pulse'
import { Toaster } from "sonner"


function App() {
  return (
    <SidebarProvider>
      <Toaster position="bottom-right" />
      <AppSidebar />
      <main className="w-full h-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewPulse />} />
        </Routes>
      </main>
    </SidebarProvider>
  )
}

export default App