import { Button } from "@/components/ui/button"
import { AppSidebar } from "./components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-separator"
import { Routes, Route } from 'react-router-dom'
import { Dashboard } from '@/components/dashboard'
import { NewPulse } from '@/components/new-pulse'


function App() {
  return (
    <SidebarProvider>
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