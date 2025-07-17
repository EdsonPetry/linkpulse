import { SidebarTrigger } from "./ui/sidebar"
import { SmallCard } from "./small-card"
import { Separator } from "@radix-ui/react-separator"

export function AllLinks() {
  return (
    <>
    <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1>All Links</h1>
    </header>
    <Separator className="h-px w-full bg-border" />
    <div className="grid grid-cols-5 gap-4 m-4 max-h-full">
        <div className="h-full w-full"><SmallCard className="h-full w-full" active={true} /></div>
        <div className="h-full w-full"><SmallCard className="h-full w-full" active={true} /></div>
        <div className="h-full w-full"><SmallCard className="h-full w-full" active={true} /></div>
        <div className="h-full w-full"><SmallCard className="h-full w-full" active={true} /></div>
        <div className="h-full w-full"><SmallCard className="h-full w-full" active={true} /></div>
        <div className="h-full w-full"><SmallCard className="h-full w-full" active={true} /></div>
        <div className="h-full w-full"><SmallCard className="h-full w-full" active={true} /></div>
        <div className="h-full w-full"><SmallCard className="h-full w-full" active={false} /></div>
    </div>
    </>
  )
}
