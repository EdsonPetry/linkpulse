import { SidebarTrigger } from "./ui/sidebar"
import { Separator } from "@radix-ui/react-separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export function LlmPage() {
  return (
    <>
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1>Talk to LLM</h1>
    </header>
    <Separator className="h-px w-full bg-border" />
    <div className="w-full h-full">
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
        </ScrollArea>
    </div>
    </>
  )
}
