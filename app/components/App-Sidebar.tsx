"use client";
import { Calendar, Home, Inbox, Plus, Search, Settings } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { create } from "domain";
import { Button } from "@/components/ui/button";

// Categories

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([
    "Work",
    "Personal",
    "Important",
  ]);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setCategories((prev) => [...prev, newFolderName]);
      setNewFolderName("");
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {/* Add new categories folder in popup*/}
          <SidebarGroupLabel>Add Folder</SidebarGroupLabel>
          <Popover>
            <PopoverTrigger asChild>
              <SidebarGroupAction title="Add Folder">
                <Plus /> <span className="sr-only">Add Folder</span>
              </SidebarGroupAction>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <PopoverHeader>
                <PopoverTitle>Add New Folder</PopoverTitle>
                <PopoverDescription>
                  Enter the name of the new folder
                </PopoverDescription>
              </PopoverHeader>
              <Input
                id="width"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button onClick={handleAddFolder}>Save</Button>
            </PopoverContent>
          </Popover>

          {/* Side bar group */}
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          {/* <SidebarGroupAction title="Add Folder" onClick={CreateFolder}>
            <Plus /> <span className="sr-only">Add Folder</span>
          </SidebarGroupAction> */}
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          {/* Folder list */}
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton asChild>
                    <a href="#">{category}</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
