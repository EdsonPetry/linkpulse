"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add URL</Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-md"
                style={{
                  backgroundColor: "white",
                  padding: "2rem",
                  zIndex: 1000,
                }}
              >
                <DialogHeader>
                  <DialogTitle>Add New URL</DialogTitle>
                  <DialogDescription>
                    Enter the details for the URL you'd like to monitor.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const form = e.currentTarget
                    const name = (form.elements.namedItem("name") as HTMLInputElement).value
                    const url = (form.elements.namedItem("url") as HTMLInputElement).value
                    const frequency = (form.elements.namedItem("frequency") as HTMLInputElement).value
                    const axios = (await import("axios")).default
                    await axios.post("/api/urls", {
                      name,
                      url,
                      frequency: Number(frequency),
                    })
                    const closeBtn = form.querySelector('[data-dialog-close]') as HTMLElement
                    closeBtn?.click()
                  }}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="e.g. My Site" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="url">URL</Label>
                    <Input id="url" name="url" type="url" placeholder="https://example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Frequency (minutes)</Label>
                    <Input id="frequency" name="frequency" type="number" min="1" required />
                  </div>
                  <DialogFooter className="sm:justify-start mt-4">
                    <DialogClose asChild>
                      <Button type="submit" variant="default" data-dialog-close>
                        Submit
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
