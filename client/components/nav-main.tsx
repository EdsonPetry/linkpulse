"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { useState } from "react"
import axios from "axios"
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

export function NavMain({items,}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    url: "",
    alias: "",
    check_interval_minutes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://127.0.0.1:5000/api/urls/", {
        url: formData.url,
        alias: formData.alias,
        check_interval_seconds: parseInt(formData.check_interval_minutes) * 60,
        http_method: "GET",
        expected_status_code: 200,
        expected_content_match: "",
        is_active: true,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setOpen(false)
    } catch (error) {
      console.error("Error creating URL:", error)
    }
  }
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="default">Create URL</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New URL</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="text"
                value={formData.url}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="alias">Alias</Label>
              <Input
                id="alias"
                name="alias"
                type="text"
                value={formData.alias}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="check_interval_minutes">Frequency (minutes)</Label>
              <Input
                id="check_interval_minutes"
                name="check_interval_minutes"
                type="number"
                min={1}
                value={formData.check_interval_minutes}
                onChange={handleChange}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
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
